import type { ModalActionRowComponentBuilder } from "discord.js";
import {
  ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";

import { createModal } from "../../../types/ModalTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const inputQuestions = {
  timezonInput: "What is your time zone?",
  ageInput: "How old are you?",
  ondutyInput: "# of hours you can spend per day to moderate?",
  punishmentInput: "Have you ever been punished in the server?",
  effectiveInput: "What about you would make you a good mod?"
} as const;

type InputID = keyof typeof inputQuestions;

const paragraphInputs = new Set([ "punishmentInput", "effectiveInput" ]);
const staffApplicationModal = new ModalBuilder()
  .setCustomId("staffapplication")
  .setTitle("👮 Apply for Moderation!");

for (const [ inputID, question ] of Object.entries(inputQuestions)) {
  const questionInput = new TextInputBuilder()
    .setCustomId(inputID)
    .setLabel(question)
    .setStyle(paragraphInputs.has(inputID) ? TextInputStyle.Paragraph : TextInputStyle.Short);

  const questionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(questionInput);
  staffApplicationModal.addComponents(questionRow);
}

const staffApplicationModalData = createModal({
  name: "staffapplication",
  allowInDMs: false,
  modal: staffApplicationModal,
  async run(bot, context) {
    const { fields } = context.interaction;
    const questionsAndAnswers = Object.keys(inputQuestions)
      .map(inputID => [ inputQuestions[inputID as InputID], fields.getTextInputValue(inputID) ] as const);

    const actingMember = await context.resolveActor();
    if (isNullish(actingMember)) return context.error("Unfortunately, I could not process your application!");

    const processResponse = await bot.services.staffApplication.postApplication(actingMember, questionsAndAnswers);
    if (processResponse.errored) return context.error(processResponse.message);

    return context.reply({
      content: "Your application has been successfully submitted!",
      ephemeral: true
    });
  }
});

export default staffApplicationModalData;
