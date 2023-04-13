import type {
  ButtonBuilder, GuildMember, Message, Options, TextChannel
} from "discord.js";
import type { SprikeyBot } from "../SprikeyBot.js";
import type { ServiceResponse } from "../utilities/ServiceResponse.js";

import { ChannelType, ActionRowBuilder } from "discord.js";
import staffApplicationButtonData from "../listeners/interaction/buttons/staffapplication.js";
import { ServiceData, ServiceError } from "../utilities/ServiceResponse.js";
import { isNullish } from "../utilities/nullishAssertion.js";
import { STAFF_APPLICATION_CHANNEL_ID, STAFF_ELIGIBILITY_ROLE_ID } from "../constants.js";

type QuestionsAndAnswers = (readonly [ string, string ])[];

export class StaffApplicationService {
  readonly bot: SprikeyBot;

  constructor(bot: SprikeyBot) {
    this.bot = bot;
  }

  static checkEligibility(member: GuildMember): boolean {
    return member.roles.cache.has(STAFF_ELIGIBILITY_ROLE_ID);
  }

  static generateApplicationButton(): Options {
    const buttonRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(staffApplicationButtonData.button);

    return {
      content: "ℹ️ Click the button below to apply for mod!",
      components: [ buttonRow ]
    };
  }

  async getStaffChannel(): Promise<ServiceResponse<TextChannel>> {
    const channels = this.bot.clients.discord.emitter.channels;
    const staffApplicationChannel = channels.resolve(STAFF_APPLICATION_CHANNEL_ID)
      ?? await channels.fetch(STAFF_APPLICATION_CHANNEL_ID);
    const isNotTextChannel = isNullish(staffApplicationChannel) || staffApplicationChannel.type !== ChannelType.GuildText;
    if (isNotTextChannel) return new ServiceError("I was unable to find the mod channel!");

    return new ServiceData(staffApplicationChannel);
  }

  async postApplication(
    member: GuildMember,
    questionsAndAnswers: QuestionsAndAnswers
  ): Promise<ServiceResponse<Message>> {
    const channelResponse = await this.getStaffChannel();
    if (channelResponse.errored) return new ServiceError(channelResponse.message);

    const applicationEmbed = {
      author: { name: member.user.username, iconUrl: member.user.displayAvatarURL() },
      title: "Staff Application",
      color: 7_440_858,
      fields: questionsAndAnswers.map(([ question, answer ]) => ({ name: question, value: answer }))
    } as const;

    try {
      const applicationMessage = await channelResponse.data.send({ embeds: [ applicationEmbed ] });
      await applicationMessage.startThread({
        name: `Discussion Space - ${member.user.username}'s application`,
        reason: "Application submission"
      });

      return new ServiceData(applicationMessage);
    } catch {
      return new ServiceError(`I was unable to send the application message to mod channel!`);
    }
  }
}
