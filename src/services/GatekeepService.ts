import type { APIInteractionGuildMember, GuildMember } from "discord.js";

import type { SprikeyBot } from "../SprikeyBot.js";
import type { ServiceResponse } from "../utilities/ServiceResponse.js";
import { ServiceData, ServiceError } from "../utilities/ServiceResponse.js";
import { ACCESS_ROLE_ID } from "../constants.js";

type APIGuildMember = APIInteractionGuildMember | GuildMember;

export class GatekeepService {
  readonly bot: SprikeyBot;

  constructor(bot: SprikeyBot) {
    this.bot = bot;
  }

  // eslint-disable-next-line class-methods-use-this
  async allowAccessToRoles(member: APIGuildMember): Promise<ServiceResponse<APIGuildMember>> {
    if (Array.isArray(member.roles)) return new ServiceError("An unexpected error occured. Please try again.");

    try {
      const guildMember = await member.roles.add(ACCESS_ROLE_ID);

      return new ServiceData(guildMember);
    } catch {
      return new ServiceError("I was unable to give you the required roles!");
    }
  }
}
