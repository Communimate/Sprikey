import type { Message } from "discord.js";
import { DIBS_CHANNEL_ID } from "../../../constants.js";
import { ArtGalleryService } from "../../../services/ArtGalleryService.js";
import { createDiscordListener } from "../../../types/DiscordTemplate.js";

const DIBS_PATTERN = /^\s*dibs\s*$/ui;
const discordMessageCreate = createDiscordListener({
  name: "messageCreate",
  runOnce: false,
  async run(bot, message) {
    if (message.author.bot) return;

    const invalidDibs = isInvalidDibs(message);
    if (invalidDibs) return message.delete();

    return bot.services.artGallery.handle(message);
  }
});

function isInvalidDibs(message: Message): boolean {
  const imageLinks = ArtGalleryService.extractMediaLinks(message, "image");
  const isDibsChannel = message.channelId === DIBS_CHANNEL_ID;
  const isNotDibsMessage = !DIBS_PATTERN.test(message.content);
  const hasNoMedia = imageLinks.length === 0;

  return isDibsChannel && isNotDibsMessage && hasNoMedia;
}

export default discordMessageCreate;
