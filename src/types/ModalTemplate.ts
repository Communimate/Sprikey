import type { InteractionResponse, ModalBuilder } from "discord.js";

import type { DiscordModalContext } from "../contexts/DiscordContext.js";
import type { SprikeyBot } from "../SprikeyBot.js";

export interface ModalTemplate<ModalName extends string = string, AllowedInDMs extends boolean = boolean> {
  readonly name: ModalName;
  readonly allowInDMs: AllowedInDMs;
  readonly modal: ModalBuilder;
  run(bot: SprikeyBot, context: DiscordModalContext<AllowedInDMs>): Promise<InteractionResponse | void>;
}

export function createModal<ModalName extends string, AllowedInDMs extends boolean>(
  modalStructure: ModalTemplate<ModalName, AllowedInDMs>
): ModalTemplate<ModalName, AllowedInDMs> {
  return modalStructure;
}
