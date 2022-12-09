import type { ModalActionRowComponentBuilder } from "discord.js";
import {
  ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";

import { ROLES_CHANNEL_ID } from "../../../constants.js";
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
  async run(bot, context) {
    const { interaction: { user, fields, member } } = context;
    const introductionDetails = {
      name: user.username,
      iconURL: user.avatarURL()!,
      aboutUser: fields.getTextInputValue("aboutInput"),
      userAge: fields.getTextInputValue("ageInput"),
      userPronouns: fields.getTextInputValue("pronounsInput"),
      userHobbies: fields.getTextInputValue("hobbiesInput")
    };

    const gatekeepResponse = await bot.services.gatekeep.allowAccessToRoles(member);
    if (gatekeepResponse.errored) return context.error(gatekeepResponse.message);

    const introductionResponse = await bot.services.introduction.postDetails(introductionDetails);
    if (introductionResponse.errored) return context.error(introductionResponse.message);

    return context.reply({
      content: `Thank you for letting us know about yourself! Grab yourself some roles from <#${ROLES_CHANNEL_ID}> to get access to the rest of the server.`,
      ephemeral: true
    });
  }
});

export default introductionModalData;
