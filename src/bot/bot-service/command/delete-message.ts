import { Context } from "vm";
import { BadRequest } from "../../exceptions/api-error.js";

export const deleteMessage = async (ctx: Context, message?: string) => {
    try {

        if (message) {
            await ctx.deleteMessage(message)
            return
        }
        const messageId = ctx.callbackQuery.message.message_id;
        await ctx.deleteMessage(messageId)

    } catch (error) {
        console.log('deleteMessage');
        
        throw await BadRequest(error as Error)
    }
}

export const deleteMessageSetTimeOut = async (ctx: Context, message?: string) => {
    try {
        if (message) {
            setTimeout(async () => {
                await ctx.deleteMessage(message)
            }, 20000)
            return
        }

        const messageId = await ctx.callbackQuery.message.message_id;
        setTimeout(async () => {
            await ctx.deleteMessage(messageId)
        }, 20000)
        
    } catch (error) {
        console.log('deleteMessageSetTimeOut');
        throw await BadRequest(error as Error)
    }
}