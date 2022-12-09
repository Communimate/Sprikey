import type { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { CommandInteraction, CommandInteractionOption } from "discord.js";
import type { SprikeyBot } from "../SprikeyBot.js";
import type { BaseContext } from "../contexts/BaseContext.js";
import type { DiscordCommandContext } from "../contexts/DiscordContext.js";

interface CommandOptionAccessors {
  getSubcommand(required?: true): string;
  getSubcommand(required: boolean): string | null;
  getSubcommandGroup(required?: true): string;
  getSubcommandGroup(required: boolean): string | null;
  getBoolean(name: string, required: true): boolean;
  getBoolean(name: string, required?: boolean): boolean | null;
  getChannel(name: string, required: true): NonNullable<CommandInteractionOption["channel"]>;
  getChannel(name: string, required?: boolean): NonNullable<CommandInteractionOption["channel"]> | null;
  getString(name: string, required: true): string;
  getString(name: string, required?: boolean): string | null;
  getInteger(name: string, required: true): number;
  getInteger(name: string, required?: boolean): number | null;
  getNumber(name: string, required: true): number;
  getNumber(name: string, required?: boolean): number | null;
  getUser(name: string, required: true): NonNullable<CommandInteractionOption["user"]>;
  getUser(name: string, required?: boolean): NonNullable<CommandInteractionOption["user"]> | null;
  getMember(name: string, required: true): NonNullable<CommandInteractionOption["member"]>;
  getMember(name: string, required?: boolean): NonNullable<CommandInteractionOption["member"]> | null;
  getRole(name: string, required: true): NonNullable<CommandInteractionOption["role"]>;
  getRole(name: string, required?: boolean): NonNullable<CommandInteractionOption["role"]> | null;
  getMentionable(
    name: string,
    required: true,
  ): NonNullable<CommandInteractionOption["member" | "role" | "user"]>;
  getMentionable(
    name: string,
    required?: boolean,
  ): NonNullable<CommandInteractionOption["member" | "role" | "user"]> | null;
  getAttachment(name: string, required: true): NonNullable<CommandInteractionOption["attachment"]>;
  getAttachment(
    name: string,
    required?: boolean,
  ): NonNullable<CommandInteractionOption["attachment"]> | null;
}

type CommandOptionTypeKeys = keyof Omit<typeof ApplicationCommandOptionType, number>;
type OptionTypeMappingsInversed = {
  [ K in CommandOptionTypeKeys as (typeof ApplicationCommandOptionType)[ K ] ]: K;
};

interface CommandOption {
  readonly name: string;
  readonly description: string;
  readonly type: ApplicationCommandOptionType;
  readonly required: boolean;
}

type SelectOptionTypeProperty<CommandOptions extends readonly CommandOption[]> = CommandOptions[ number ][ "type" ];
type ReadonlyCommandOptions = readonly CommandOption[];

type PickOptionNamesContainingType<
  Options extends ReadonlyCommandOptions,
  TypeToMatch extends ApplicationCommandOptionType
> = Options extends readonly [
  infer FirstData extends CommandOption,
  ...infer RestData extends ReadonlyCommandOptions
]
  ? FirstData extends { type: TypeToMatch; }
    ? [ FirstData["name"], ...PickOptionNamesContainingType<RestData, TypeToMatch> ]
    : PickOptionNamesContainingType<RestData, TypeToMatch>
  : [];

type MapOptionTypesToNames<CommandOptions extends readonly CommandOption[]> = {
  [ K in SelectOptionTypeProperty<CommandOptions> as OptionTypeMappingsInversed[ K ] ]:
  PickOptionNamesContainingType<CommandOptions, K>[ number ];
};

type OverridenOptionAccessors<CommandOptions extends readonly CommandOption[]> = {
  [ K in keyof MapOptionTypesToNames<CommandOptions> as `get${K}` ]: MapOptionTypesToNames<CommandOptions>[ K ] extends never
    ? CommandOptionAccessors[`get${K}`]
    : {
        (name: MapOptionTypesToNames<CommandOptions>[K], required: true): NonNullable<ReturnType<CommandOptionAccessors[`get${K}`]>>;
        (name: MapOptionTypesToNames<CommandOptions>[K], required?: boolean): NonNullable<ReturnType<CommandOptionAccessors[`get${K}`]>> | null;
      }
};

export type ContexedCommandInteraction<GivenOptions extends readonly CommandOption[]> = Omit<CommandInteraction, "options"> & {
  options: OverridenOptionAccessors<GivenOptions>;
};

interface OnlyDiscordCompatible {
  discord: true;
}

interface BothCompatible {
  discord: true;
  other: true;
}

type CommandCompatibility = BothCompatible | OnlyDiscordCompatible;
type PickCompatibleContext<GivenCompatibility extends CommandCompatibility, AllowedInDMs extends boolean> = (
  GivenCompatibility extends BothCompatible ? BaseContext : DiscordCommandContext<AllowedInDMs>
);

// Contexted command interaction: ContexedCommandInteraction<GivenOptions>
export interface CommandTemplate<
  GivenCompatibility extends CommandCompatibility = CommandCompatibility,
  GivenOptions extends ReadonlyCommandOptions = ReadonlyCommandOptions,
  AllowedInDMs extends boolean = boolean
> {
  readonly name: string;
  readonly description: string;
  readonly allowInDMs: AllowedInDMs;
  readonly guildPermissions: bigint;
  readonly compatibility: GivenOptions[0] extends undefined ? GivenCompatibility : { discord: true; };
  readonly options: GivenOptions;
  run(
    client: SprikeyBot,
    context: PickCompatibleContext<GivenCompatibility, AllowedInDMs>
  ): Promise<unknown>;
}

export interface DiscordCommandTemplate<
  GivenOptions extends ReadonlyCommandOptions = ReadonlyCommandOptions,
  AllowedInDMs extends boolean = boolean
> {
  readonly name: string;
  readonly description: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly dm_permission: AllowedInDMs;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly default_member_permissions: string;
  readonly options: GivenOptions;
}

export function createCommand<
  GivenCompatibility extends CommandCompatibility,
  GivenOptions extends ReadonlyCommandOptions,
  AllowedInDMs extends boolean
>(
  commandStructure: CommandTemplate<GivenCompatibility, GivenOptions, AllowedInDMs>
): CommandTemplate<GivenCompatibility, GivenOptions, AllowedInDMs> {
  return commandStructure;
}

export function transformToDiscordCommand<
  GivenCompatibility extends CommandCompatibility,
  GivenOptions extends ReadonlyCommandOptions,
  AllowedInDMs extends boolean
>(
  commandStructure: CommandTemplate<GivenCompatibility, GivenOptions, AllowedInDMs>
): DiscordCommandTemplate<GivenOptions, AllowedInDMs> {
  return {
    options: commandStructure.options,
    name: commandStructure.name,
    description: commandStructure.description,
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    dm_permission: commandStructure.allowInDMs,
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    default_member_permissions: commandStructure.guildPermissions.toString()
  };
}

export {
  ApplicationCommandOptionType as CommandOptionType,
  PermissionFlagsBits as PermissionFlags
} from "discord-api-types/v10";
