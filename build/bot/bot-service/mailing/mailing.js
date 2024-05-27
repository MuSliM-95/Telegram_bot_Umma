import { chatController } from "../../../db/controllers/chatController.js";
import { deleteMailingList } from "../../options.js";
import { adminCommand } from "../../../index.js";
import { bot } from "../../bot-commands/commands.js";
import { BadRequest } from "../../exceptions/api-error.js";
export async function sendNewsletter(message, ctx) {
    try {
        const chatIdArr = await chatController.getChat();
        if (!chatIdArr || chatIdArr.length < 0) {
            return;
        }
        adminCommand.messageidArr = [];
        const message_ID = await ctx.reply('Рассылка начата!');
        await Promise.all(chatIdArr.map(async (id, index) => {
            const messageid = await ctx.copyMessage(id, process.env.CHAT_ID, message);
            adminCommand.messageidArr[index] = messageid;
        }));
        adminCommand.newsletter = false;
        await ctx.reply('Рассылка окончена. Функция рассылки отключена!', { reply_markup: deleteMailingList(message_ID.message_id) });
    }
    catch (error) {
        throw await BadRequest(error);
    }
}
export async function deleteNewsletter(ctx) {
    try {
        const chatIdArr = await chatController.getChat();
        if (!chatIdArr || chatIdArr.length < 0) {
            return;
        }
        await Promise.all(chatIdArr.map(async (id, index) => {
            var _a;
            await bot.telegram.deleteMessage(id, +((_a = adminCommand.messageidArr[index]) === null || _a === void 0 ? void 0 : _a.message_id));
        }));
        adminCommand.messageidArr = [];
        await ctx.reply('Рассылка успешна удалена!');
    }
    catch (error) {
        throw await BadRequest(error);
    }
}
//# sourceMappingURL=mailing.js.map