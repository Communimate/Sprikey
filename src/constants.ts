import { isNullish } from "./utilities/nullishAssertion.js";

/* eslint-disable node/no-process-env */
export const DISCORD_COLOR = "#5865f2";

export const ACCESS_ROLE_ID = "";
export const ROLES_CHANNEL_ID = "";
export const ANNOUNCEMENT_CHANNEL_ID = "";
export const INTRODUCTION_CHANNEL_ID = "";

if (isNullish(process.env.ANIMATION_CHANNEL_ID)) throw new Error("Animation Channel ID not found!");
if (isNullish(process.env.ART_GALLERY_CHANNEL_ID)) throw new Error("Art Gallery Channel ID not found!");
if (isNullish(process.env.ART_ONE_CHANNEL_ID)) throw new Error("Art One Channel ID not found!");
if (isNullish(process.env.ART_TWO_CHANNEL_ID)) throw new Error("Art Two Channel ID not found!");
if (isNullish(process.env.DIBS_CHANNEL_ID)) throw new Error("Dibs Channel ID not found!");
if (isNullish(process.env.ROLEBAN_CHANNEL_ID)) throw new Error("Roleban Channel ID not found!");
if (isNullish(process.env.ROLEBAN_ROLE_ID)) throw new Error("Roleban Role ID not found!");

export const ANIMATION_CHANNEL_ID = process.env.ANIMATION_CHANNEL_ID;
export const ART_GALLERY_CHANNEL_ID = process.env.ART_GALLERY_CHANNEL_ID;
export const ART_ONE_CHANNEL_ID = process.env.ART_ONE_CHANNEL_ID;
export const ART_TWO_CHANNEL_ID = process.env.ART_TWO_CHANNEL_ID;
export const DIBS_CHANNEL_ID = process.env.DIBS_CHANNEL_ID;
export const ROLEBAN_CHANNEL_ID = process.env.ROLEBAN_CHANNEL_ID;
export const ROLEBAN_ROLE_ID = process.env.ROLEBAN_ROLE_ID;
