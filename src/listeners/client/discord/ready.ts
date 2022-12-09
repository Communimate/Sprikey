import { createDiscordListener } from "../../../types/DiscordTemplate.js";
import { discordLog } from "../../../utilities/logger.js";

const discordReady = createDiscordListener({
  name: "ready",
  runOnce: false,
  run() {
    void discordLog("Bot is ready!");
  }
});

export default discordReady;
