import { chatController } from "../../db/controllers/chatController.js";
export const myChatMember = (bot) => {
    bot.on('my_chat_member', async (ctx) => {
        const chatInfo = ctx.update.my_chat_member;
        const { status } = chatInfo.new_chat_member;
        const { id } = chatInfo.chat;
        if (status === 'kicked') {
            await chatController.chatRemove(id);
        }
    });
};
//# sourceMappingURL=my-chat-member.js.map