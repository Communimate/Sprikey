import type { RESTPostAPIContextMenuApplicationCommandsJSONBody } from "discord.js";
import type { DiscordCommandTemplate } from "./types/CommandTemplate.js";

import { Routes } from "discord.js";
import { DISCORD_BOT_TOKEN } from "./config.js";
import { DiscordClient } from "./handlers/client/DiscordClient.js";
import { ButtonHandler } from "./handlers/interaction/ButtonHandler.js";
import { CommandHandler } from "./handlers/interaction/CommandHandler.js";
import { MenuHandler } from "./handlers/interaction/MenuHandler.js";
import { ModalHandler } from "./handlers/interaction/ModalHandler.js";
import { ArtGalleryService } from "./services/ArtGalleryService.js";
import { RolebanService } from "./services/RolebanService.js";
import { StaffApplicationService } from "./services/StaffApplicationService.js";

type APICommand = DiscordCommandTemplate | RESTPostAPIContextMenuApplicationCommandsJSONBody;

class BotClients {
  readonly discord: DiscordClient;

  constructor(bot: SprikeyBot) {
    this.discord = new DiscordClient(bot);
  }

  async instantiateAll(): Promise<void> {
    await this.discord.loadAndRegisterListeners();
  }

  async registerCommands(commands: APICommand[]): Promise<void> {
    await this.discord.rest
      .put(Routes.applicationCommands(this.discord.applicationID), { body: commands });
  }
}

class BotInteractions {
  readonly button: ButtonHandler;
  readonly command: CommandHandler;
  readonly menu: MenuHandler;
  readonly modal: ModalHandler;

  constructor(bot: SprikeyBot) {
    this.button = new ButtonHandler(bot);
    this.command = new CommandHandler(bot);
    this.menu = new MenuHandler(bot);
    this.modal = new ModalHandler(bot);
  }

  async instantiateAll(): Promise<void> {
    await Promise.all([
      this.button.loadAndRegisterListeners(),
      this.command.loadAndRegisterListeners(),
      this.menu.loadAndRegisterListeners(),
      this.modal.loadAndRegisterListeners()
    ]);
  }

  getCommands(): APICommand[] {
    return [ ...this.command.commands, ...this.menu.menus ];
  }
}

class BotServices {
  readonly artGallery: ArtGalleryService;
  readonly roleban: RolebanService;
  readonly staffApplication: StaffApplicationService;

  constructor(bot: SprikeyBot) {
    this.artGallery = new ArtGalleryService(bot);
    this.roleban = new RolebanService(bot);
    this.staffApplication = new StaffApplicationService(bot);
  }
}

export class SprikeyBot {
  readonly clients: BotClients;
  readonly interactions: BotInteractions;
  readonly services: BotServices;

  constructor() {
    this.clients = new BotClients(this);
    this.interactions = new BotInteractions(this);
    this.services = new BotServices(this);
  }

  async login(): Promise<SprikeyBot> {
    await Promise.all([
      this.clients.instantiateAll(),
      this.interactions.instantiateAll()
    ]);
    await this.clients.registerCommands(this.interactions.getCommands());
    await this.clients.discord.emitter.login(DISCORD_BOT_TOKEN);

    return this;
  }
}
