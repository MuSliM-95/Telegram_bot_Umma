import { adminKeyboard, infoText, keyboardСontainer } from "../options.js";
import { chatController } from "../../db/controllers/chatController.js";
export const startCommand = (bot) => {
    bot.start(async (ctx) => {
        const id = ctx.update.message.chat.id;
        const name = ctx.update.message.chat.first_name;
        await ctx.replyWithHTML(infoText(), id == process.env.CHAT_ID ? adminKeyboard(id) : keyboardСontainer(id)),
            await chatController.addChat({
                first_name: name,
                chatId: id,
                chat: false,
            });
    });
};
//# sourceMappingURL=start-command.js.map