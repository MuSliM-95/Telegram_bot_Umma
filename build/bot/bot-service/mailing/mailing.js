import { chatController } from "../../../db/controllers/chatController.js";
import { deleteMailingList } from "../../options.js";
import { adminCommand } from "../../../index.js";
import { bot } from "../../bot-commands/commands.js";
export const sendNewsletter = async (message, ctx, index = 0) => {
    var _a;
    try {
        const chatIdArr = await chatController.getChat();
        if (!chatIdArr || chatIdArr.length < 0) {
            return;
        }
        if (index === 0) {
            adminCommand.message_ID = await ctx.reply('Рассылка начата!');
            adminCommand.messageidArr = [];
        }
        const id = chatIdArr[index];
        if (index < chatIdArr.length) {
            const messageid = await ctx.copyMessage(id, process.env.CHAT_ID, message);
            adminCommand.messageidArr[index] = messageid;
            return sendNewsletter(message, ctx, index + 1);
        }
        adminCommand.newsletter = false;
        await ctx.reply('Рассылка окончена. Функция рассылки отключена!', { reply_markup: deleteMailingList(adminCommand.message_ID.message_id) });
    }
    catch (error) {
        const err = error;
        const chat_id = (_a = err.on) === null || _a === void 0 ? void 0 : _a.payload.chat_id;
        return sendNewsletter(message, ctx, index + 1);
    }
};
export const deleteNewsletter = async (ctx, index = 0) => {
    var _a;
    try {
        const chatIdArr = await chatController.getChat();
        if (!chatIdArr || chatIdArr.length < 0) {
            return;
        }
        const id = chatIdArr[index];
        if (index < chatIdArr.length) {
            await bot.telegram.deleteMessage(id, +((_a = adminCommand.messageidArr[index]) === null || _a === void 0 ? void 0 : _a.message_id));
            return deleteNewsletter(ctx, index + 1);
        }
        adminCommand.messageidArr = [];
        await ctx.reply('Рассылка успешна удалена!');
    }
    catch (error) {
        const err = error;
        const chat_id = err.on.payload.chat_id;
        console.log(chat_id);
        return deleteNewsletter(ctx, index + 1);
    }
};
//# sourceMappingURL=mailing.js.map