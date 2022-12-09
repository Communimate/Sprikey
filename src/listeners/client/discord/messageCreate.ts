import { createDiscordListener } from "../../../types/DiscordTemplate.js";
import { discordLog } from "../../../utilities/logger.js";

const discordMessageCreate = createDiscordListener({
  name: "messageCreate",
  runOnce: false,
  run(_bot, message) {
    void discordLog(message.content);
  }
});

export default discordMessageCreate;
