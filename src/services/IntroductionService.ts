import type { Message, TextBasedChannel } from "discord.js";
import { EmbedBuilder } from "discord.js";

import type { DiscordNonModalContext } from "../contexts/DiscordContext.js";
import type introductionModalData from "../listeners/interaction/modals/introduction.js";
import type { SprikeyBot } from "../SprikeyBot.js";
import type { ServiceResponse } from "../utilities/ServiceResponse.js";
import { INTRODUCTION_CHANNEL_ID } from "../constants.js";
import { isNullish } from "../utilities/nullishAssertion.js";
import { ServiceData, ServiceError } from "../utilities/ServiceResponse.js";

interface IntroductionDetails {
  readonly name: string;
  readonly iconURL: string;
  readonly aboutUser: string;
  readonly userAge: string;
  readonly userPronouns: string;
  readonly userHobbies: string;
}

function generateIntroductionEmbed({
  name, iconURL, aboutUser, userAge, userPronouns, userHobbies
}: IntroductionDetails): EmbedBuilder {
  return new EmbedBuilder()
    .setAuthor({
      name,
      iconURL
    })
    .setDescription([
      `🙋 **About Me:** ${aboutUser}`,
      `🧙 **My Age:** ${userAge}`,
      `❔ **My Pronouns**: ${userPronouns}`,
      `⚽ **My Hobbies:** ${userHobbies}`
    ].join("\n"));
}

/**
 * Manages Receiving and Posting introduction messages
 *
 * Two types of methods:
 * - Possessive: Require context to manage user interface
 * - Implicit: Require raw data to produce side-effect
 */
export class IntroductionService {
  readonly bot: SprikeyBot;

  constructor(bot: SprikeyBot) {
    this.bot = bot;
  }

  get introductionModal(): (typeof introductionModalData)["modal"] {
    const introductionModal = this.bot.interactions.modal.listeners.get("introduction")?.modal;
    if (isNullish(introductionModal)) throw new Error("Missing Introduction modal!");

    return introductionModal;
  }

  async getIntroductionChannel(): Promise<ServiceResponse<TextBasedChannel>> {
    const introductionChannel = await this.bot.clients.discord.emitter.channels.fetch(INTRODUCTION_CHANNEL_ID);
    if (isNullish(introductionChannel) || !introductionChannel.isTextBased()) return new ServiceError("Missing Introduction channel!");

    return new ServiceData(introductionChannel);
  }

  async requestDetailsUsing(context: DiscordNonModalContext<false>): Promise<void> {
    return context.showModal(this.introductionModal);
  }

  async postDetails(introductionDetails: IntroductionDetails): Promise<ServiceResponse<Message>> {
    const serviceResponse = await this.getIntroductionChannel();
    if (serviceResponse.errored) return serviceResponse;

    const introductionChannel = serviceResponse.data;
    const embedToSend = generateIntroductionEmbed(introductionDetails);

    try {
      const sentMessage = await introductionChannel.send({ embeds: [ embedToSend ] });

      return new ServiceData(sentMessage);
    } catch {
      return new ServiceError("Could not send introduction message to the introduction channel!");
    }
  }
}
