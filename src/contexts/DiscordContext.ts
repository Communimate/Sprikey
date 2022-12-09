/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import type {
  CommandInteraction, InteractionReplyOptions, InteractionResponse, Message, BaseMessageOptions, MessagePayload
} from "discord.js";

import type {
  RequiredInteractions, PickModalInteraction, PickButtonInteraction, PickCommandInteraction, PickNonModalInteraction
} from "../types/CustomInteractions.js";
import { BaseContext, BaseFormatter } from "./BaseContext.js";

type ShowModalMethod = CommandInteraction[ "showModal" ];
type DeferReplyMethod = CommandInteraction[ "deferReply" ];
type EditReplyMethod = CommandInteraction[ "editReply" ];

class DiscordFormatter extends BaseFormatter {
  hyperlink(text: string, url: `https://${string}`): string {
    return `[${text}](<${url}>)`;
  }
}

export class DiscordBaseContext extends BaseContext {
  readonly interaction: RequiredInteractions;

  constructor(interaction: RequiredInteractions) {
    const formatter = new DiscordFormatter();
    super(formatter);
    this.interaction = interaction;
  }

  override async reply(options: InteractionReplyOptions | MessagePayload | string): Promise<InteractionResponse> {
    return this.interaction.reply(options);
  }

  override async send(options: BaseMessageOptions | MessagePayload | string): Promise<Message | undefined> {
    return this.interaction.channel?.send(options);
  }

  override async error(errorMessage: string): Promise<InteractionResponse> {
    return this.interaction.reply({
      content: errorMessage,
      ephemeral: true
    });
  }

  async deferReply(options?: Parameters<DeferReplyMethod>[ 0 ]): ReturnType<DeferReplyMethod> {
    return this.interaction.deferReply(options);
  }

  async editReply(options: Parameters<EditReplyMethod>[ 0 ]): ReturnType<EditReplyMethod> {
    return this.interaction.editReply(options);
  }
}

export class DiscordNonModalContext<AllowedInDMs extends boolean> extends DiscordBaseContext {
  override readonly interaction: PickNonModalInteraction<AllowedInDMs>;

  constructor(interaction: PickNonModalInteraction<AllowedInDMs>) {
    super(interaction);
    this.interaction = interaction;
  }

  async showModal(modal: Parameters<ShowModalMethod>[ 0 ]): ReturnType<ShowModalMethod> {
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

export class DiscordCommandContext<AllowedInDMs extends boolean> extends DiscordNonModalContext<AllowedInDMs> {
  override readonly interaction: PickCommandInteraction<AllowedInDMs>;

  constructor(interaction: PickCommandInteraction<AllowedInDMs>) {
    super(interaction);
    this.interaction = interaction;
  }
}
