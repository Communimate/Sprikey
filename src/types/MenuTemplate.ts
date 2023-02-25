import type { ContextMenuCommandBuilder, InteractionResponse } from "discord.js";
import type { DiscordMessageMenuContext, DiscordUserMenuContext } from "../contexts/DiscordContext.js";
import type { SprikeyBot } from "../SprikeyBot.js";

export interface UserMenuTemplate<MenuName extends string = string, AllowedInDMs extends boolean = boolean> {
  readonly name: MenuName;
  readonly allowInDMs: AllowedInDMs;
  readonly menu: ContextMenuCommandBuilder;
  run(bot: SprikeyBot, context: DiscordUserMenuContext<AllowedInDMs>): Promise<InteractionResponse | void>;
}

export function createUserMenu<MenuName extends string, AllowedInDMs extends boolean>(
  menuStructure: UserMenuTemplate<MenuName, AllowedInDMs>
): UserMenuTemplate<MenuName, AllowedInDMs> {
  return menuStructure;
}

export interface MessageMenuTemplate<MenuName extends string = string, AllowedInDMs extends boolean = boolean> {
  readonly name: MenuName;
  readonly allowInDMs: AllowedInDMs;
  readonly menu: ContextMenuCommandBuilder;
  run(bot: SprikeyBot, context: DiscordMessageMenuContext<AllowedInDMs>): Promise<InteractionResponse | void>;
}

export function createMessageMenu<MenuName extends string, AllowedInDMs extends boolean>(
  menuStructure: MessageMenuTemplate<MenuName, AllowedInDMs>
): MessageMenuTemplate<MenuName, AllowedInDMs> {
  return menuStructure;
}
