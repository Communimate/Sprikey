import type { SprikeyBot } from "../../SprikeyBot.js";
import { InteractionHandler } from "../BaseHandler.js";

export class ButtonHandler extends InteractionHandler<"buttons"> {
  constructor(bot: SprikeyBot) {
    super(bot, "buttons");
  }

  registerListeners(): void {
    for (const [ buttonName, buttonData ] of this.listeners.entries()) {
      this.emitter.on(buttonName, buttonData.run.bind(buttonData));
    }
  }
}
