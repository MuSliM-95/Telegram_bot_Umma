import { botCommands } from "../bot-service/сommand/getData.js";
export async function BadRequest(error) {
    botCommands.errors++;
    console.log(error);
}
//# sourceMappingURL=api-error.js.map