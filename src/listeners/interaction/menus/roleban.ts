import { ApplicationCommandType, ContextMenuCommandBuilder, PermissionFlagsBits } from "discord.js";
import { createUserMenu } from "../../../types/MenuTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const rolebanUserMenu = new ContextMenuCommandBuilder()
  .setName("Roleban User")
  .setType(ApplicationCommandType.User)
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

const rolebanUserMenuData = createUserMenu({
  name: "roleban",
  allowInDMs: false,
  menu: rolebanUserMenu,
  async run(bot, context) {
    context.deferReply({ ephemeral: true });

    const actingMember = await context.resolveActor();
    const targetMember = await context.resolveTarget();
    if (isNullish(actingMember) || isNullish(targetMember)) return context.error("I was unable to roleban the target member! Please try again.");

    const rolebanResponse = await bot.services.roleban.rolebanMember(actingMember, targetMember);
    if (rolebanResponse.errored) return context.error(rolebanResponse.message);

    return context.reply({
      content: rolebanResponse.data,
      ephemeral: true
    });
  }
});

export default rolebanUserMenuData;
