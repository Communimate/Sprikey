import type {
  InteractionReplyOptions, InteractionResponse, Message, BaseMessageOptions, MessagePayload
} from "discord.js";

export type RequiredReplyOptions = InteractionReplyOptions & { content: string; };
export type RequiredMessageOptions = BaseMessageOptions & { content: string; };
export type SayReturnType = [ string ] | [ string, string ];

export abstract class BaseFormatter {
  abstract hyperlink(text: string, url: `https://${string}`, nameFormat: "bracket" | "dictionary"): string;
}

export abstract class BaseContext {
  readonly formatter: BaseFormatter;

  constructor(formatter: BaseFormatter) {
    this.formatter = formatter;
  }

  abstract reply(
    options: MessagePayload | RequiredReplyOptions | string
  ): Promise<InteractionResponse | SayReturnType | void>;

  abstract send(
    options: MessagePayload | RequiredMessageOptions | string
  ): Promise<Message | SayReturnType | void>;

  abstract error(
    options: string
  ): Promise<InteractionResponse | SayReturnType | void>;
}
