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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async run(_bot, _context) {}
});

export default introductionButtonData;
