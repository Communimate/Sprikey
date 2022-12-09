import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function createLinkButtonRow(label: string, url: `https://${string}`): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel(label)
        .setURL(url)
    );
}
