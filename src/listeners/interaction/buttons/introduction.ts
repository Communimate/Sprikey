import { ButtonBuilder, ButtonStyle } from "discord.js";

import { createButton } from "../../../types/ButtonTemplate.js";

const introductionButton = new ButtonBuilder()
  .setCustomId("introduction")
  .setLabel("Introduce Yourself!")
  .setStyle(ButtonStyle.Primary)
  .setEmoji("👋");

const introductionButtonData = createButton({
  name: "introduction",
  allowInDMs: false,
  button: introductionButton,
  async run(bot, context) {
    return bot.services.introduction.requestDetailsUsing(context);
  }
});

export default introductionButtonData;
