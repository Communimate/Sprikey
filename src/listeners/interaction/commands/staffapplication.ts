import { createCommand, PermissionFlags } from "../../../types/CommandTemplate.js";
import { StaffApplicationService } from "../../../services/StaffApplicationService.js";

const staffApplicationButtonCommand = createCommand({
  name: "staffapplication",
  description: "Makes the staff application available",
  allowInDMs: true,
  guildPermissions: PermissionFlags.Administrator,
  compatibility: { discord: true },
  options: [],
  async run(_bot, context) {
    context.deferReply({ ephemeral: true });

    try {
      await context.send(StaffApplicationService.generateApplicationButton());
    } catch (sendError: unknown) {
      console.error(sendError);

      return context.error("Could not set up the Staff Application button!");
    }

    return context.editReply("Successfully set up the Staff Application button!");
  }
});

export default staffApplicationButtonCommand;
