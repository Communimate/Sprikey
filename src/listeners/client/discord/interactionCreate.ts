import type {
  ButtonInteraction, ChatInputCommandInteraction, MessageContextMenuCommandInteraction,
  ModalSubmitInteraction, UserContextMenuCommandInteraction
} from "discord.js";

import type { SprikeyBot } from "../../../SprikeyBot.js";
import { createDiscordListener } from "../../../types/DiscordTemplate.js";
import {
  DiscordBaseContext, DiscordButtonContext, DiscordCommandContext, DiscordMessageMenuContext, DiscordUserMenuContext
} from "../../../contexts/DiscordContext.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

type MenuCommandInteractions = MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction;

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

function invokeMenuInteraction(bot: SprikeyBot, interaction: MenuCommandInteractions): void {
  const context = interaction.isUserContextMenuCommand()
    ? new DiscordUserMenuContext(interaction)
    : new DiscordMessageMenuContext(interaction);

  bot.interactions.menu.emitter.emit(`${interaction.commandName}-${interaction.type}`, bot, context);
}
const discordInteractionCreate = createDiscordListener({
  name: "interactionCreate",
  runOnce: false,
  run(bot, interaction) {
    if (interaction.isButton()) invokeButtonInteraction(bot, interaction);
    else if (interaction.isChatInputCommand()) invokeSlashCommandInteraction(bot, interaction);
    else if (interaction.isModalSubmit()) invokeModalInteraction(bot, interaction);
    else if (interaction.isContextMenuCommand()) invokeMenuInteraction(bot, interaction);
  }
});

export default discordInteractionCreate;
