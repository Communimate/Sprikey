import { DISCORD_BOT_TOKEN } from "./config.js";
import { DiscordClient } from "./handlers/client/DiscordClient.js";
import { ButtonHandler } from "./handlers/interaction/ButtonHandler.js";
import { CommandHandler } from "./handlers/interaction/CommandHandler.js";
import { MenuHandler } from "./handlers/interaction/MenuHandler.js";
import { ModalHandler } from "./handlers/interaction/ModalHandler.js";
import { ArtGalleryService } from "./services/ArtGalleryService.js";

class BotClients {
  readonly discord: DiscordClient;

  constructor(bot: SprikeyBot) {
    this.discord = new DiscordClient(bot);
  }

  async instantiateAll(): Promise<void> {
    await this.discord.loadAndRegisterListeners();
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
}

class BotServices {
  readonly artGallery: ArtGalleryService;

  constructor(bot: SprikeyBot) {
    this.artGallery = new ArtGalleryService(bot);
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
    await this.clients.discord.emitter.login(DISCORD_BOT_TOKEN);

    return this;
  }
}
