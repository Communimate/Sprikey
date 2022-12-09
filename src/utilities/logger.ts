/* eslint-disable @typescript-eslint/require-await */
import chalk from "chalk";
import { DISCORD_COLOR } from "../constants.js";

export async function discordLog(...content: unknown[]): Promise<void> {
  console.log(chalk.hex(DISCORD_COLOR)("DISCORD"), ...content);
}
