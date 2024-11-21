import { botCommands } from "../../bot/bot-service/command/getData.js";
import { BadRequest } from "../../bot/exceptions/api-error.js";


export async function ErrorMiddleware(err: Error) {
    if (err) {
        botCommands.errors++

        return await  BadRequest(err)
    }
}

