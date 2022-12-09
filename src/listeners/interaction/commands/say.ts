import { CommandOptionType, createCommand, PermissionFlags } from "../../../types/CommandTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const sayCommand = createCommand({
  name: "say",
  description: "Say something!",
  allowInDMs: true,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: { discord: true },
  options: [
    {
      name: "text",
      type: CommandOptionType.String,
      description: "Enter the text you want me to say",
      required: true
    }
  ] as const,
  async run(_bot, context) {
    const textToSay = context.interaction.options.getString("text");
    if (isNullish(textToSay)) return context.error("You have not provided anything for me to say!");

    return context.reply(textToSay);
  }
});

export default sayCommand;
