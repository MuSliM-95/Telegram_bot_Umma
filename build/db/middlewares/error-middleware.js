import { botCommands } from "../../bot/bot-service/сommand/getData.js";
export async function ErrorMiddleware(err) {
    if (err) {
        botCommands.errors++;
        console.log(err);
    }
}
//# sourceMappingURL=error-middleware.js.map