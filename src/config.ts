/* eslint-disable node/no-process-env */
import { GatewayIntentBits } from "discord.js";

import { isNullish } from "./utilities/nullishAssertion.js";

if (isNullish(process.env.DISCORD_BOT_TOKEN)) throw new Error("Discord Bot token not found!");
if (isNullish(process.env.DISCORD_BOT_APPLICATION_ID)) throw new Error("Discord Bot application ID not found!");

export const PORT = process.env.PORT ?? 5000;

export const DISCORD_API_VERSION = "10";
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
export const DISCORD_BOT_APPLICATION_ID = process.env.DISCORD_BOT_APPLICATION_ID;
export const DISCORD_BOT_CONFIG = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions
  ]
};
