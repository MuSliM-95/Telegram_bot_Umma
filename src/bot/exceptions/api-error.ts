import { bot } from "../bot-commands/commands.js"
import { botCommands } from "../bot-service/сommand/getData.js"


export async function BadRequest(error: Error) {
    botCommands.errors++
    console.log(error);
    // return await bot.telegram.sendMessage(process.env.BADREQUEST!, `${error.message}`)
}