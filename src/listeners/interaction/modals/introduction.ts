import type { ModalActionRowComponentBuilder } from "discord.js";
import {
  ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";

import { createModal } from "../../../types/ModalTemplate.js";

const aboutInput = new TextInputBuilder()
  .setCustomId("aboutInput")
  .setLabel("🙋 Tell us a bit about yourself!")
  .setStyle(TextInputStyle.Paragraph);

const ageInput = new TextInputBuilder()
  .setCustomId("ageInput")
  .setLabel("🧙 How old are you?")
  .setStyle(TextInputStyle.Short);

const pronounsInput = new TextInputBuilder()
  .setCustomId("pronounsInput")
  .setLabel("❔ What pronous would you like to be called?")
  .setStyle(TextInputStyle.Short);

const hobbiesInput = new TextInputBuilder()
  .setCustomId("hobbiesInput")
  .setLabel("⚽ Tell us a bit more about your hobbies!")
  .setStyle(TextInputStyle.Paragraph);

const introductionModal = new ModalBuilder()
  .setCustomId("introduction")
  .setTitle("👋 Introduce Yourself!")
  .addComponents(
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(aboutInput),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(ageInput),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(pronounsInput),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hobbiesInput)
  );

const introductionModalData = createModal({
  name: "introduction",
  allowInDMs: false,
  modal: introductionModal,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async run(_bot, _context) {}
});

export default introductionModalData;
