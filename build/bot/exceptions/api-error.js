import { botCommands } from "../bot-service/command/getData.js";
export async function BadRequest(error) {
    botCommands.errors++;
}
//# sourceMappingURL=api-error.js.map