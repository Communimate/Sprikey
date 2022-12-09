import type { ButtonBuilder, InteractionResponse } from "discord.js";
import type { DiscordButtonContext } from "../contexts/DiscordContext.js";
import type { SprikeyBot } from "../SprikeyBot.js";

export interface ButtonTemplate<ButtonName extends string = string, AllowedInDMs extends boolean = boolean> {
  readonly name: ButtonName;
  readonly allowInDMs: AllowedInDMs;
  readonly button: ButtonBuilder;
  run(bot: SprikeyBot, context: DiscordButtonContext<AllowedInDMs>): Promise<InteractionResponse | void>;
}

export function createButton<ButtonName extends string, AllowedInDMs extends boolean>(
  buttonStructure: ButtonTemplate<ButtonName, AllowedInDMs>
): ButtonTemplate<ButtonName, AllowedInDMs> {
  return buttonStructure;
}
