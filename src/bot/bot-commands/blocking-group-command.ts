import { NextFunction } from "express";
import { Context } from "vm";


// Блокируем обработку команд для не приватных чатов.
export const commandsBlockingInGrups = (bot: Context) => {

    bot.use(async (ctx: Context, next: NextFunction) => {
        if (ctx.chat.type !== "private") {
            return await ctx.reply('Извините, я работаю только в приватных чатах.');
        } else {
            next()
        }
    })
}