import { createCommand, PermissionFlags } from "../../../types/CommandTemplate.js";

const pingCommand = createCommand({
  name: "ping",
  description: "Replies with 'Pong!'",
  allowInDMs: true,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: {
    discord: true,
    twitch: true
  },
  options: [],
  async run(_bot, context) {
    return context.reply("Pong!");
  }
});

export default pingCommand;
