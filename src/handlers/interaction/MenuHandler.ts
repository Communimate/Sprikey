import type { RESTPostAPIContextMenuApplicationCommandsJSONBody } from "discord.js";
import type { SprikeyBot } from "../../SprikeyBot.js";
import { InteractionHandler } from "../BaseHandler.js";

export class MenuHandler extends InteractionHandler<"menus"> {
  readonly menus: RESTPostAPIContextMenuApplicationCommandsJSONBody[] = [];

  constructor(bot: SprikeyBot) {
    super(bot, "menus");
  }

  registerListeners(): void {
    for (const menuData of this.listeners.values()) {
      this.menus.push(menuData.menu.toJSON());
      this.emitter.on(`${menuData.menu.name}-${menuData.menu.type}`, menuData.run.bind(menuData));
    }
  }
}
