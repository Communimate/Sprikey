import "dotenv/config";
import { SprikeyBot } from "./SprikeyBot.js";
import { PORT } from "./config.js";
import { sprikeyApp } from "./server.js";

const bot = new SprikeyBot();
await bot.login();

sprikeyApp.listen(PORT);
