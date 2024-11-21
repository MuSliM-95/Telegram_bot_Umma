import { bot } from "../bot-commands/commands.js"
import { botCommands } from "../bot-service/command/getData.js"

export async function BadRequest(error: Error) {
    botCommands.errors++    
    return await bot.telegram.sendMessage(process.env.BADREQUEST!, `${error.message}`)
}

