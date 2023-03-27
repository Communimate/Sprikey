import type { BaseContext } from "../../contexts/BaseContext.js";
import type { SprikeyBot } from "../../SprikeyBot.js";
import type { CommandTemplate, DiscordCommandTemplate } from "../../types/CommandTemplate.js";
import { InteractionHandler } from "../BaseHandler.js";
import { transformToDiscordCommand } from "../../types/CommandTemplate.js";

type ListenerArguments = Parameters<CommandTemplate[ "run" ]>;

export class CommandHandler extends InteractionHandler<"commands"> {
  readonly commands: DiscordCommandTemplate[] = [];

  constructor(bot: SprikeyBot) {
    super(bot, "commands");
  }

  registerListeners(): void {
    for (const [ commandName, command ] of this.listeners.entries()) {
      this.commands.push(transformToDiscordCommand(command));

      this.emitter.on(
        commandName,
        async(...listenerArguments: ListenerArguments) => command.run(...listenerArguments)
      );
    }
  }

  runIfCompatible(command: CommandTemplate, source: "discord", bot: SprikeyBot, context: BaseContext): unknown {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!command.compatibility[source]) return;

    return this.emitter.emit(command.name, bot, context);
  }
}
