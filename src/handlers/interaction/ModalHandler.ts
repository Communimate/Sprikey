import type { SprikeyBot } from "../../SprikeyBot.js";
import { InteractionHandler } from "../BaseHandler.js";

export class ModalHandler extends InteractionHandler<"modals"> {
  constructor(bot: SprikeyBot) {
    super(bot, "modals");
  }

  registerListeners(): void {
    for (const [ modalName, modalData ] of this.listeners.entries()) {
      this.emitter.on(modalName, modalData.run.bind(modalData));
    }
  }
}
