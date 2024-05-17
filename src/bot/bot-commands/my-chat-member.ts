import { Context } from "vm";
import { chatController } from "../../db/controllers/chatController.js";

// Отслеживает поведения пользователя, удаляет пользователя из db, в случае блокировки.
export const myChatMember = (bot: Context) => {
    bot.on('my_chat_member', async (ctx: Context) => {
        const chatInfo = ctx.update.my_chat_member;
        const { status } = chatInfo.new_chat_member;
        const { id } = chatInfo.chat;

        if (status === 'kicked') {
            await chatController.chatRemove(id);
        }
    });
}


