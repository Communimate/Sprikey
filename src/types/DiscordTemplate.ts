import type { ClientEvents as DiscordEvents } from "discord.js";
import type { SprikeyBot } from "../SprikeyBot.js";

type DiscordEventNames = keyof DiscordEvents;

export interface DiscordTemplate<EventName extends DiscordEventNames = DiscordEventNames> {
  readonly name: EventName;
  readonly runOnce: boolean;
  run(bot: SprikeyBot, ...restArguments: DiscordEvents[EventName]): unknown;
}

export function createDiscordListener<EventName extends DiscordEventNames>(
  discordListenerStructure: DiscordTemplate<EventName>
): DiscordTemplate<EventName> {
  return discordListenerStructure;
}
