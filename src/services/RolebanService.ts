import type {
  ButtonBuilder, Guild, GuildMember, GuildMemberRoleManager, Message, Snowflake, TextChannel
} from "discord.js";
import { ActionRowBuilder, ChannelType } from "discord.js";
import type { SprikeyBot } from "../SprikeyBot.js";
import type { ServiceResponse } from "../utilities/ServiceResponse.js";

import { ROLEBAN_CHANNEL_ID, ROLEBAN_ROLE_ID } from "../constants.js";
import { isNullish } from "../utilities/nullishAssertion.js";
import { ServiceData, ServiceError } from "../utilities/ServiceResponse.js";
import { PermissionFlags } from "../types/CommandTemplate.js";
import unrolebanButtonData from "../listeners/interaction/buttons/unroleban.js";

type RoleCollection = GuildMemberRoleManager[ "cache" ];

const MEMBER_MENTION_PATTERN = /<@!?(\d+)>/ui;
const ROLE_MENTION_PATTERN = /<@&(\d+)>/gui;

export class RolebanService {
  readonly bot: SprikeyBot;
  readonly rolebans = new Map<Snowflake, Snowflake[]>();

  constructor(bot: SprikeyBot) {
    this.bot = bot;
  }

  static async getModeratableStatus(actingMember: GuildMember, targetMember: GuildMember): Promise<boolean> {
    const members = targetMember.guild.members;
    const botMember = members.resolve(targetMember.client.user.id) ?? await members.fetchMe();

    const isLowerThanBot = targetMember.roles.highest.comparePositionTo(botMember.roles.highest) < 0;
    const isLowerThanActor = targetMember.roles.highest.comparePositionTo(actingMember.roles.highest) < 0;
    const canActorModerate = actingMember.permissions.has(PermissionFlags.ManageRoles);

    return isLowerThanBot && isLowerThanActor && canActorModerate;
  }

  static async getTargetMember(controlMessage: Message, guild: Guild): Promise<ServiceResponse<GuildMember>> {
    const [ messageEmbed ] = controlMessage.embeds;
    if (isNullish(messageEmbed)) return new ServiceError("I was unable to give back the roles of the target member as their roleban embed is missing!");

    const [ , memberID ] = messageEmbed.description?.match(MEMBER_MENTION_PATTERN) ?? [];
    if (isNullish(memberID)) return new ServiceError("I was unable to figure out who the target member is, as their roleban embed is corrupted!");

    return new ServiceData(guild.members.resolve(memberID) ?? await guild.members.fetch(memberID));
  }

  static getRolebanStatus(member: GuildMember): boolean {
    return member.roles.cache.has(ROLEBAN_ROLE_ID);
  }

  static async sendUnrolebanNotification(member: GuildMember, controlMessage: Message): Promise<ServiceResponse<Message>> {
    void controlMessage.unpin();

    await controlMessage.edit({
      content: controlMessage.content,
      embeds: controlMessage.embeds,
      components: []
    });

    const notification = await controlMessage.reply({ content: `${member.toString()} has been unrolebanned!` });

    return new ServiceData(notification);
  }

  async getRolebanChannel(): Promise<ServiceResponse<TextChannel>> {
    const channels = this.bot.clients.discord.emitter.channels;
    const rolebanChannel = channels.resolve(ROLEBAN_CHANNEL_ID) ?? await channels.fetch(ROLEBAN_CHANNEL_ID);
    const isNotTextChannel = isNullish(rolebanChannel) || rolebanChannel.type !== ChannelType.GuildText;
    if (isNotTextChannel) return new ServiceError("I was unable to find the talking-room channel!");

    return new ServiceData(rolebanChannel);
  }

  async assignRolebanRole(member: GuildMember): Promise<ServiceResponse<RoleCollection>> {
    const memberRoles = member.roles.cache.filter(role => role.id !== member.guild.id);
    const memberRoleIDs = [ ...memberRoles.keys() ];
    this.rolebans.set(member.id, memberRoleIDs);

    try {
      await member.roles.set([ ROLEBAN_ROLE_ID ]);

      return new ServiceData(memberRoles);
    } catch {
      return new ServiceError(`I am unable to roleban ${member.toString()}!`);
    }
  }

  async giveRolesBack(targetMember: GuildMember, controlMessage: Message): Promise<ServiceResponse<Snowflake[]>> {
    const memberRoleIDs = this.recoverRoles(targetMember, controlMessage);
    if (memberRoleIDs.errored) return new ServiceError(memberRoleIDs.message);

    try {
      await targetMember.roles.set(memberRoleIDs.data);
      this.rolebans.delete(targetMember.id);

      return new ServiceData(memberRoleIDs.data);
    } catch {
      return new ServiceError(`I am unable to unroleban ${targetMember.toString()}!`);
    }
  }

  recoverRoles(targetMember: GuildMember, controlMessage: Message): ServiceResponse<string[]> {
    const cachedRoles = this.rolebans.get(targetMember.id);
    if (!isNullish(cachedRoles)) return new ServiceData(cachedRoles);

    const [ messageEmbed ] = controlMessage.embeds;
    if (isNullish(messageEmbed)) return new ServiceError("I was unable to give back the roles of the target member as their roleban embed is missing!");

    const roleTags = messageEmbed.fields[0]?.value;
    if (isNullish(roleTags)) return new ServiceError(`I was unable to figure out <@${targetMember.id}>'s roles, as their roleban embed is corrupted!`);

    return new ServiceData([ ...roleTags.matchAll(ROLE_MENTION_PATTERN) ]
      .map(match => match[1] ?? "")
      .filter(match => match));
  }

  async sendControlMessage(member: GuildMember, memberRoles: RoleCollection): Promise<ServiceResponse<Message>> {
    const channelResponse = await this.getRolebanChannel();
    if (channelResponse.errored) return new ServiceError(`${member.toString()} has been rolebanned, but ${channelResponse.message}`);

    const memberRoleTags = [ ...memberRoles.mapValues(role => role.toString()).values() ].join(", ");
    const messageEmbed = {
      author: { name: member.user.username, iconUrl: member.user.displayAvatarURL() },
      title: "Roleban System",
      color: 7_440_858,
      description: `Hello ${member.toString()}! You have been brought here by the staff of this server for some questioning. Please listen to and cooperate with the staff to avoid any trouble. Thank you.\n\n⚠️ **Leaving the server will lead to a permament ban!**`,
      fields: [{ name: "Roles", value: memberRoleTags, inline: true }]
    };

    try {
      const controlMessage = await channelResponse.data.send({
        content: member.toString(),
        embeds: [ messageEmbed ],
        components: [ new ActionRowBuilder<ButtonBuilder>().addComponents(unrolebanButtonData.button) ]
      });

      void controlMessage.pin(`Keep track of ${member.toString()}'s roleban`);

      return new ServiceData(controlMessage);
    } catch {
      return new ServiceError(`${member.toString()} has been rolebanned, but I was unable to send a message in talking-room!`);
    }
  }

  async rolebanMember(actingMember: GuildMember, targetMember: GuildMember): Promise<ServiceResponse<string>> {
    if (RolebanService.getRolebanStatus(targetMember)) return new ServiceError(`${targetMember.toString()} is already rolebanned!`);

    const isMemberModeratable = await RolebanService.getModeratableStatus(actingMember, targetMember);
    if (!isMemberModeratable) return new ServiceError(`I do not have the permission to roleban ${targetMember.toString()}!`);

    const roleResponse = await this.assignRolebanRole(targetMember);
    if (roleResponse.errored) return roleResponse;

    const messageResponse = await this.sendControlMessage(targetMember, roleResponse.data);
    if (messageResponse.errored) return messageResponse;

    return new ServiceData(`${targetMember.toString()} has been successfully rolebanned!`);
  }

  async unrolebanMember(actingMember: GuildMember, controlMessage: Message): Promise<ServiceResponse<string>> {
    const memberResponse = await RolebanService.getTargetMember(controlMessage, actingMember.guild);
    if (memberResponse.errored) return memberResponse;

    const targetMember = memberResponse.data;
    if (!RolebanService.getRolebanStatus(targetMember)) return new ServiceError(`${targetMember.toString()} is not rolebanned!`);

    const isMemberModeratable = await RolebanService.getModeratableStatus(actingMember, targetMember);
    if (!isMemberModeratable) return new ServiceError(`I do not have the permission to unroleban ${targetMember.toString()}!`);

    const roleResponse = await this.giveRolesBack(targetMember, controlMessage);
    if (roleResponse.errored) return roleResponse;

    void RolebanService.sendUnrolebanNotification(targetMember, controlMessage);

    return new ServiceData(`${targetMember.toString()} has been successfully unrolebanned!`);
  }
}
