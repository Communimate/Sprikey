import type { Message, MessageCreateOptions, TextChannel } from "discord.js";
import type { SprikeyBot } from "../SprikeyBot.js";
import type { ServiceResponse } from "../utilities/ServiceResponse.js";
import type { Entries } from "type-fest";

import { ChannelType } from "discord.js";
import {
  ANIMATION_CHANNEL_ID, ART_GALLERY_CHANNEL_ID, ART_ONE_CHANNEL_ID, ART_TWO_CHANNEL_ID
} from "../constants.js";
import { isNullish } from "../utilities/nullishAssertion.js";
import { ServiceData, ServiceError } from "../utilities/ServiceResponse.js";

type MediaType = "image" | "video";

const MEDIA_PATTERNS = {
  image: "https?:\\/\\/cdn.discord(?:app)?\\.com\\/attachments\\/\\d+\\/\\d+\\/[^\\\\ ]+?\\.(?:webp|png|jpg|jpeg)",
  video: "https?:\\/\\/cdn.discord(?:app)?\\.com\\/attachments\\/\\d+\\/\\d+\\/[^\\\\ ]+?\\.(?:mp4|mov|avi)"
};

const MEDIA_CHANNELS = {
  image: [ ART_ONE_CHANNEL_ID, ART_TWO_CHANNEL_ID ],
  video: [ ANIMATION_CHANNEL_ID ]
} as const;

export class ArtGalleryService {
  readonly bot: SprikeyBot;

  constructor(bot: SprikeyBot) {
    this.bot = bot;
  }

  static extractMediaLinks(message: Message, type: MediaType): string[] {
    const attachedMediaLinks = [ ...message.attachments.values() ]
      .filter(({ url }) => new RegExp(MEDIA_PATTERNS[type], "gui").test(url))
      .map(({ url }) => url);

    // Use match for capturing all occurences
    const linkedMediaLinks = message.content.match(new RegExp(MEDIA_PATTERNS[type], "gui")) ?? [];
    const mediaLinks = [
      ...attachedMediaLinks,
      ...linkedMediaLinks
    ];

    return mediaLinks;
  }

  static extractAppropriateMediaLinks(message: Message): string[] {
    const [ mediaType ] = (Object.entries(MEDIA_CHANNELS) as Entries<typeof MEDIA_CHANNELS>)
      .find(([ _mediaType, mediaChannels ]) => mediaChannels.includes(message.channelId))
      ?? [];

    return isNullish(mediaType)
      ? []
      : ArtGalleryService.extractMediaLinks(message, mediaType);
  }

  static removeLinksFromContent(content: string): string {
    return content
      .replaceAll(new RegExp(MEDIA_PATTERNS.image, "gui"), "")
      .replaceAll(new RegExp(MEDIA_PATTERNS.video, "gui"), "")
      .trim();
  }

  static getMediaLinkMessages(message: Message, mediaLinks: string[]): MessageCreateOptions[] {
    const sanitizedDescription = ArtGalleryService.removeLinksFromContent(message.content);

    return mediaLinks.map(mediaLink => ({
      content: `**Content made by @${message.author.tag}** (${message.id})\n\n${sanitizedDescription}`,
      files: [{ attachment: mediaLink }]
    }));
  }

  async getArtGalleryChannel(): Promise<ServiceResponse<TextChannel>> {
    const introductionChannel = await this.bot.clients.discord.emitter.channels.fetch(ART_GALLERY_CHANNEL_ID);
    const isNotTextChannel = isNullish(introductionChannel) || introductionChannel.type !== ChannelType.GuildText;
    if (isNotTextChannel) return new ServiceError("Missing Art Gallery channel!");

    return new ServiceData(introductionChannel);
  }

  async sendMessages(formattedMessages: MessageCreateOptions[]): Promise<ServiceError | void> {
    const channelRequest = await this.getArtGalleryChannel();
    if (channelRequest.errored) return channelRequest;

    const artGalleryChannel = channelRequest.data;

    for (const formattedMessage of formattedMessages) {
      void artGalleryChannel.send(formattedMessage);
    }
  }

  async handle(message: Message): Promise<ServiceError | void> {
    const mediaLinks = ArtGalleryService.extractAppropriateMediaLinks(message);
    if (mediaLinks.length === 0) return;

    const formattedMessages = ArtGalleryService.getMediaLinkMessages(message, mediaLinks);

    return this.sendMessages(formattedMessages);
  }
}
