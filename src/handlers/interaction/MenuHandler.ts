import { Routes } from "discord.js";
import type { SprikeyBot } from "../../SprikeyBot.js";
import { InteractionHandler } from "../BaseHandler.js";

export class MenuHandler extends InteractionHandler<"menus"> {
  constructor(bot: SprikeyBot) {
    super(bot, "menus");
  }

  async registerListeners(): Promise<void> {
    const menus = [];

    for (const menuData of this.listeners.values()) {
      menus.push(menuData.menu.toJSON());
      this.emitter.on(`${menuData.menu.name}-${menuData.menu.type}`, menuData.run.bind(menuData));
    }

    await this.bot.clients.discord.rest
      .put(Routes.applicationCommands(this.bot.clients.discord.applicationID), { body: menus });
  }
}
