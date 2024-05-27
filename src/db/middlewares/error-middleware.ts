
import { bot } from "../../bot/bot-commands/commands.js";
import { botCommands } from "../../bot/bot-service/сommand/getData.js";


export async function ErrorMiddleware(err: Error) {
    if (err) {
        botCommands.errors++
        console.log(err);
        
        // return await bot.telegram.sendMessage(process.env.BADREQUEST!, `Непредвиденная ошибка: ${err.message}, ${err}`)
    }
}