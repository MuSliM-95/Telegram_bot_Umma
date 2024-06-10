import { bot } from "../../bot/bot-commands/commands.js";
import { botCommands } from "../../bot/bot-service/сommand/getData.js";
export async function ErrorMiddleware(err) {
    if (err) {
        botCommands.errors++;
        return await bot.telegram.sendMessage(process.env.BADREQUEST, `${err.message}`);
    }
}
//# sourceMappingURL=error-middleware.js.map