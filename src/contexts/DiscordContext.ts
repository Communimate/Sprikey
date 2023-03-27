/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import type {
  CommandInteraction, InteractionReplyOptions, InteractionResponse, Message, BaseMessageOptions, MessagePayload, GuildMember
} from "discord.js";
import { ChannelType } from "discord.js";

import type {
  RequiredInteractions, PickModalInteraction, PickButtonInteraction, PickCommandInteraction,
  PickNonModalInteraction, PickMessageContextMenuInteraction, PickUserContextMenuInteraction
} from "../types/CustomInteractions.js";
import { isNullish } from "../utilities/nullishAssertion.js";
import { BaseContext, BaseFormatter } from "./BaseContext.js";

type ShowModalMethod = CommandInteraction[ "showModal" ];
type DeferReplyMethod = CommandInteraction[ "deferReply" ];
type EditReplyMethod = CommandInteraction[ "editReply" ];

class DiscordFormatter extends BaseFormatter {
  hyperlink(text: string, url: `https://${string}`): string {
    return `[${text}](<${url}>)`;
  }
}

type ReplyOptions = InteractionReplyOptions | MessagePayload | string;

export class DiscordBaseContext extends BaseContext {
  readonly interaction: RequiredInteractions;
  deferer?: ReturnType<DeferReplyMethod>;

  constructor(interaction: RequiredInteractions) {
    const formatter = new DiscordFormatter();
    super(formatter);
    this.interaction = interaction;
  }

  override async reply(options: ReplyOptions): Promise<InteractionResponse | Message> {
    await this.deferer;

    return isNullish(this.deferer)
      ? this.interaction.reply(options)
      : this.interaction.editReply(options);
  }

  override async send(options: BaseMessageOptions | MessagePayload | string): Promise<Message | undefined> {
    if (isNullish(this.interaction.channel) || this.interaction.channel.type === ChannelType.GuildStageVoice) return;

    return this.interaction.channel.send(options);
  }

  override async error(errorMessage: string): Promise<InteractionResponse | Message> {
    await this.deferer;

    const replyOptions = {
      content: errorMessage,
      ephemeral: true
    };

    return isNullish(this.deferer)
      ? this.interaction.reply(replyOptions)
      : this.editReply(replyOptions);
  }

  deferReply(options?: Parameters<DeferReplyMethod>[ 0 ]): void {
    this.deferer = this.interaction.deferReply(options);
  }

  async editReply(options: Parameters<EditReplyMethod>[ 0 ]): ReturnType<EditReplyMethod> {
    await this.deferer;

    return this.interaction.editReply(options);
  }

  async resolveMember(memberID: string): Promise<GuildMember | undefined> {
    const members = this.interaction.guild?.members;
    if (isNullish(members)) return;

    return members.resolve(memberID) ?? await members.fetch(memberID);
  }

  async resolveActor(): Promise<GuildMember | undefined> {
    if (isNullish(this.interaction.member)) return;

    return this.resolveMember(this.interaction.member.user.id);
  }
}

export class DiscordNonModalContext<AllowedInDMs extends boolean> extends DiscordBaseContext {
  override readonly interaction: PickNonModalInteraction<AllowedInDMs>;

  constructor(interaction: PickNonModalInteraction<AllowedInDMs>) {
    super(interaction);
    this.interaction = interaction;
  }

  async showModal(modal: Parameters<ShowModalMethod>[ 0 ]): ReturnType<ShowModalMethod> {
    await this.deferer;

    return this.interaction.showModal(modal);
  }
}

export class DiscordModalContext<AllowedInDMs extends boolean> extends DiscordBaseContext {
  override readonly interaction: PickModalInteraction<AllowedInDMs>;

  constructor(interaction: PickModalInteraction<AllowedInDMs>) {
    super(interaction);
    this.interaction = interaction;
  }
}

export class DiscordButtonContext<AllowedInDMs extends boolean> extends DiscordNonModalContext<AllowedInDMs> {
  override readonly interaction: PickButtonInteraction<AllowedInDMs>;

  constructor(interaction: PickButtonInteraction<AllowedInDMs>) {
    super(interaction);
    this.interaction = interaction;
  }
}

export class DiscordUserMenuContext<AllowedInDMs extends boolean> extends DiscordNonModalContext<AllowedInDMs> {
  override readonly interaction: PickUserContextMenuInteraction<AllowedInDMs>;

  constructor(interaction: PickUserContextMenuInteraction<AllowedInDMs>) {
    super(interaction);
    this.interaction = interaction;
  }

  async resolveTarget(): Promise<GuildMember | undefined> {
    return this.resolveMember(this.interaction.targetId);
  }
}

export class DiscordMessageMenuContext<AllowedInDMs extends boolean> extends DiscordNonModalContext<AllowedInDMs> {
  override readonly interaction: PickMessageContextMenuInteraction<AllowedInDMs>;

  constructor(interaction: PickMessageContextMenuInteraction<AllowedInDMs>) {
    super(interaction);
    this.interaction = interaction;
  }
}

export class DiscordCommandContext<AllowedInDMs extends boolean> extends DiscordNonModalContext<AllowedInDMs> {
  override readonly interaction: PickCommandInteraction<AllowedInDMs>;

  constructor(interaction: PickCommandInteraction<AllowedInDMs>) {
    super(interaction);
    this.interaction = interaction;
  }
}
