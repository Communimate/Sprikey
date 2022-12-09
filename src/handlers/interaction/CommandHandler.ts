import { Routes } from "discord-api-types/v9";

import type { BaseContext } from "../../contexts/BaseContext.js";
import type { SprikeyBot } from "../../SprikeyBot.js";
import type { CommandTemplate, DiscordCommandTemplate } from "../../types/CommandTemplate.js";
import { InteractionHandler } from "../BaseHandler.js";
import { transformToDiscordCommand } from "../../types/CommandTemplate.js";

type ListenerArguments = Parameters<CommandTemplate[ "run" ]>;

export class CommandHandler extends InteractionHandler<"commands"> {
  constructor(bot: SprikeyBot) {
    super(bot, "commands");
  }

  async registerListeners(): Promise<void> {
    const commands: DiscordCommandTemplate[] = [];

    for (const [ commandName, command ] of this.listeners.entries()) {
      commands.push(transformToDiscordCommand(command));

      this.emitter.on(
        commandName,
        async(...listenerArguments: ListenerArguments) => command.run(...listenerArguments)
      );
    }

    await this.bot.clients.discord.rest
      .put(Routes.applicationCommands(this.bot.clients.discord.applicationID), { body: commands });
  }

  runIfCompatible(command: CommandTemplate, source: "discord", bot: SprikeyBot, context: BaseContext): unknown {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!command.compatibility[source]) return;

    return this.emitter.emit(command.name, bot, context);
  }
}
