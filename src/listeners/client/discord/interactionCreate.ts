import type { ButtonInteraction, ChatInputCommandInteraction, ModalSubmitInteraction } from "discord.js";

import type { SprikeyBot } from "../../../SprikeyBot.js";
import { createDiscordListener } from "../../../types/DiscordTemplate.js";
import { DiscordBaseContext, DiscordButtonContext, DiscordCommandContext } from "../../../contexts/DiscordContext.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

function invokeButtonInteraction(bot: SprikeyBot, interaction: ButtonInteraction): void {
  const context = new DiscordButtonContext(interaction);
  const { customId } = interaction;
  bot.interactions.button.emitter.emit(customId, bot, context);
}

function invokeSlashCommandInteraction(bot: SprikeyBot, interaction: ChatInputCommandInteraction): void {
  const { commandName } = interaction;
  const context = new DiscordCommandContext(interaction);
  const command = bot.interactions.command.listeners.get(commandName);
  if (isNullish(command)) return;

  bot.interactions.command.runIfCompatible(command, "discord", bot, context);
}

function invokeModalInteraction(bot: SprikeyBot, interaction: ModalSubmitInteraction): void {
  const { customId } = interaction;
  const context = new DiscordBaseContext(interaction);
  bot.interactions.modal.emitter.emit(customId, bot, context);
}
const discordInteractionCreate = createDiscordListener({
  name: "interactionCreate",
  runOnce: false,
  run(bot, interaction) {
    if (interaction.isButton()) invokeButtonInteraction(bot, interaction);
    else if (interaction.isChatInputCommand()) invokeSlashCommandInteraction(bot, interaction);
    else if (interaction.isModalSubmit()) invokeModalInteraction(bot, interaction);
  }
});

export default discordInteractionCreate;
