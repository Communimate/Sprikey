import { Client as DJSClient, REST } from "discord.js";

import type { SprikeyBot } from "../../SprikeyBot.js";
import { ClientHandler } from "../BaseHandler.js";
import {
  DISCORD_API_VERSION, DISCORD_BOT_APPLICATION_ID, DISCORD_BOT_CONFIG, DISCORD_BOT_TOKEN
} from "../../config.js";

export class DiscordClient extends ClientHandler<"discord"> {
  override readonly emitter: DJSClient;
  readonly applicationID: string;
  readonly rest: REST;

  constructor(bot: SprikeyBot) {
    const discordClient = new DJSClient(DISCORD_BOT_CONFIG);
    super(bot, "discord");
    this.emitter = discordClient;
    this.applicationID = DISCORD_BOT_APPLICATION_ID;
    this.rest = new REST({ version: DISCORD_API_VERSION }).setToken(DISCORD_BOT_TOKEN);
  }

  registerListeners(): void {
    for (const [ eventName, eventListener ] of this.listeners.entries()) {
      // @ts-expect-error EventEmitter callback is registered properly
      if (eventListener.runOnce) this.emitter.once(eventName, eventListener.run.bind(eventListener));

      // @ts-expect-error EventEmitter callback is registered properly
      else this.emitter.on(eventName, eventListener.run.bind(eventListener, this.bot));
    }
  }
}
