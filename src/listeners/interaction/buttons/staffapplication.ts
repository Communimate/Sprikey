import { ButtonBuilder, ButtonStyle } from "discord.js";

import { createButton } from "../../../types/ButtonTemplate.js";
import { StaffApplicationService } from "../../../services/StaffApplicationService.js";
import staffApplicationModalData from "../modals/staffapplication.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const staffApplicationButton = new ButtonBuilder()
  .setCustomId("staffapplication")
  .setLabel("Apply Now!")
  .setStyle(ButtonStyle.Success)
  .setEmoji("📩");

const staffApplicationButtonData = createButton({
  name: "staffapplication",
  allowInDMs: false,
  button: staffApplicationButton,
  async run(_bot, context) {
    const actingMember = await context.resolveActor();
    if (isNullish(actingMember)) return context.error("Unfortunately, something went wrong!");
    if (!StaffApplicationService.checkEligibility(actingMember)) return context.error("😓 Uh oh! You are not eligible to apply for staff positions yet!");

    return context.showModal(staffApplicationModalData.modal);
  }
});

export default staffApplicationButtonData;
