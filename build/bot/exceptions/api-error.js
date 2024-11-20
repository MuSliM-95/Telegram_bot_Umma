import { bot } from "../bot-commands/commands.js";
import { botCommands } from "../bot-service/command/getData.js";
export async function BadRequest(error) {
    botCommands.errors++;
    return await bot.telegram.sendMessage(process.env.BADREQUEST, `${error.message}`);
}
//# sourceMappingURL=api-error.js.map