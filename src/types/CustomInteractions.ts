import type {
  ButtonInteraction, ChatInputCommandInteraction, Interaction, MessageContextMenuCommandInteraction,
  AnySelectMenuInteraction, ModalSubmitInteraction, UserContextMenuCommandInteraction
} from "discord.js";
import type { SetNonNullable } from "type-fest";

type GuildInteraction<GivenInteraction extends Interaction> = SetNonNullable<GivenInteraction, "guild" | "member">;

export type GuildButtonInteraction = GuildInteraction<ButtonInteraction>;
export type ButtonInteractions = ButtonInteraction | GuildButtonInteraction;
export type PickButtonInteraction<AllowedInDMs extends boolean> = AllowedInDMs extends true
  ? ButtonInteraction
  : GuildButtonInteraction;

export type GuildChatInputCommandInteraction = GuildInteraction<ChatInputCommandInteraction>;
export type ChatInputCommandInteractions = ChatInputCommandInteraction | GuildChatInputCommandInteraction;
export type PickCommandInteraction<AllowedInDMs extends boolean> = AllowedInDMs extends true
  ? ChatInputCommandInteraction
  : GuildChatInputCommandInteraction;

export type GuildMessageContextMenuCommandInteraction = GuildInteraction<MessageContextMenuCommandInteraction>;
export type MessageContextMenuCommandInteractions = GuildMessageContextMenuCommandInteraction
| MessageContextMenuCommandInteraction;
export type PickMessageContextMenuInteraction<AllowedInDMs extends boolean> = AllowedInDMs extends true
  ? MessageContextMenuCommandInteraction
  : GuildMessageContextMenuCommandInteraction;

export type GuildSelectMenuInteraction = GuildInteraction<AnySelectMenuInteraction>;
export type SelectMenuInteractions = AnySelectMenuInteraction | GuildSelectMenuInteraction;
export type PickSelectMenuInteraction<AllowedInDMs extends boolean> = AllowedInDMs extends true
  ? AnySelectMenuInteraction
  : GuildSelectMenuInteraction;

export type GuildUserContextMenuCommandInteraction = GuildInteraction<UserContextMenuCommandInteraction>;
export type UserContextMenuCommandInteractions = GuildUserContextMenuCommandInteraction | UserContextMenuCommandInteraction;
export type PickUserContextMenuInteraction<AllowedInDMs extends boolean> = AllowedInDMs extends true
  ? UserContextMenuCommandInteraction
  : GuildUserContextMenuCommandInteraction;

export type GuildModalSubmitInteraction = GuildInteraction<ModalSubmitInteraction>;
export type ModalInteractions = GuildModalSubmitInteraction | ModalSubmitInteraction;
export type PickModalInteraction<AllowedInDMs extends boolean> = AllowedInDMs extends true
  ? ModalSubmitInteraction
  : GuildModalSubmitInteraction;

export type GuildNonModalInteractions = GuildButtonInteraction
| GuildChatInputCommandInteraction
| GuildMessageContextMenuCommandInteraction
| GuildSelectMenuInteraction
| GuildUserContextMenuCommandInteraction;
export type NonGuildNonModalInteractions = AnySelectMenuInteraction
| ButtonInteraction
| ChatInputCommandInteraction
| MessageContextMenuCommandInteraction
| UserContextMenuCommandInteraction;

export type NonModalInteractions = GuildNonModalInteractions | NonGuildNonModalInteractions;
export type PickNonModalInteraction<AllowedInDMs extends boolean> = AllowedInDMs extends true
  ? NonGuildNonModalInteractions
  : GuildNonModalInteractions;

export type RequiredInteractions = ModalInteractions | NonModalInteractions;
