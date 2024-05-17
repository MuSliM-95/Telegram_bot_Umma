import { BadRequest } from "../../exceptions/api-error.js";
export const deleteMessage = async (ctx, message) => {
    try {
        if (message) {
            await ctx.deleteMessage(message);
            return;
        }
        const messageId = ctx.callbackQuery.message.message_id;
        await ctx.deleteMessage(messageId);
    }
    catch (error) {
        throw await BadRequest(error);
    }
};
export const deleteMessageSetTimeOut = async (ctx, message) => {
    try {
        if (message) {
            setTimeout(async () => {
                await ctx.deleteMessage(message);
            }, 20000);
            return;
        }
        const messageId = await ctx.callbackQuery.message.message_id;
        setTimeout(async () => {
            await ctx.deleteMessage(messageId);
        }, 20000);
    }
    catch (error) {
        throw await BadRequest(error);
    }
};
//# sourceMappingURL=delete-message.js.map