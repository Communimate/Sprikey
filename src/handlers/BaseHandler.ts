import EventEmitter from "node:events";
import path from "node:path";
import { readdir } from "node:fs/promises";

import type { SprikeyBot } from "../SprikeyBot.js";
import type { ButtonTemplate } from "../types/ButtonTemplate.js";
import type { CommandTemplate } from "../types/CommandTemplate.js";
import type { DiscordTemplate } from "../types/DiscordTemplate.js";
import type { ModalTemplate } from "../types/ModalTemplate.js";

interface ClientListenerTemplates {
  discord: DiscordTemplate;
}

interface InteractionListenerTemplates {
  buttons: ButtonTemplate;
  commands: CommandTemplate;
  modals: ModalTemplate;
}

type ListenerStructures = ClientListenerTemplates & InteractionListenerTemplates;

type ClientListenerNames = keyof ClientListenerTemplates;
type InteractionListenerNames = keyof InteractionListenerTemplates;
type ListenerNames = keyof ListenerStructures;

export type BaseEventEmitter = Pick<EventEmitter, "emit" | "on" | "removeAllListeners">;

const listenerType: Record<ClientListenerNames | InteractionListenerNames, "client" | "interaction"> = {
  buttons: "interaction",
  commands: "interaction",
  discord: "client",
  modals: "interaction"
};

abstract class BaseHandler<ListenerName extends ListenerNames> {
  readonly bot: SprikeyBot;
  readonly emitter: BaseEventEmitter = new EventEmitter();
  readonly listeners = new Map<string, ListenerStructures[ListenerName]>();
  #listenerName: ListenerName;
  #listenerDirectory: string;

  constructor(bot: SprikeyBot, listenerToHandle: ListenerName) {
    const listenerTypeDirectory = `dist/listeners/${listenerType[listenerToHandle]}`;
    this.#listenerName = listenerToHandle;
    this.#listenerDirectory = path.join(process.cwd(), listenerTypeDirectory, this.#listenerName);
    this.bot = bot;
  }

  async fetchListenerFilenames(): Promise<string[]> {
    const directoryContents = await readdir(this.#listenerDirectory);
    const directoryFiles = directoryContents
      .filter(directoryContent => directoryContent.endsWith(".js"));

    return directoryFiles;
  }

  async loadListeners(): Promise<BaseHandler<ListenerName>["listeners"]> {
    const listenerFilenames = await this.fetchListenerFilenames();
    await Promise.all(
      listenerFilenames
        .map(async listenerFilename => {
          const listenerName = listenerFilename.split(".")[0]!;
          const listenerPath = path.join(this.#listenerDirectory, listenerFilename);

          const { "default": listenerData } = await import(listenerPath) as { default: ListenerStructures[ ListenerName ]; };
          if (this.listeners.has(listenerName)) this.unloadListener(listenerName);

          this.listeners.set(listenerName, listenerData);
        })
    );

    return this.listeners;
  }

  async loadAndRegisterListeners(): Promise<void> {
    await this.loadListeners();
    await this.registerListeners();
  }

  unloadListener(listenerName: string): boolean {
    this.emitter.removeAllListeners(listenerName);

    return this.listeners.delete(listenerName);
  }

  abstract registerListeners(): Promise<void> | void;
}

export abstract class ClientHandler<ListenerName extends ClientListenerNames> extends BaseHandler<ListenerName> {}
export abstract class InteractionHandler<ListenerName extends InteractionListenerNames> extends BaseHandler<ListenerName> {}
