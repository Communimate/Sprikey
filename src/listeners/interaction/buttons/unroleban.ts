import { ButtonBuilder, ButtonStyle } from "discord.js";

import { createButton } from "../../../types/ButtonTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const unrolebanButton = new ButtonBuilder()
  .setCustomId("unroleban")
  .setLabel("Unroleban Member")
  .setStyle(ButtonStyle.Danger);

const unrolebanButtonData = createButton({
  name: "unroleban",
  allowInDMs: false,
  button: unrolebanButton,
  async run(bot, context) {
    context.deferReply({ ephemeral: true });

    const controlMessage = context.interaction.message;
    const actingMember = await context.resolveActor();
    if (isNullish(actingMember)) return context.error("An unexpected error occured!");

    const unrolebanResponse = await bot.services.roleban.unrolebanMember(actingMember, controlMessage);
    if (unrolebanResponse.errored) return context.error(unrolebanResponse.message);

    return context.reply({ content: unrolebanResponse.data });
  }
});

export default unrolebanButtonData;
