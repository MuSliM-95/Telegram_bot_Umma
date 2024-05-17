import { adminKeyboard, infoText, keyboardСontainer } from "../options.js";
import { chatController } from "../../db/controllers/chatController.js";
import { ChatTypes } from "../../types/global-types.js";
import { Context } from "vm";

export const startCommand = (bot: Context) => {
    bot.start(async (ctx: Context) => {
        const id = ctx.update.message.chat.id
        const name = ctx.update.message.chat.first_name

        await ctx.replyWithHTML(
            infoText(),
            id == process.env.CHAT_ID! ? adminKeyboard(id) : keyboardСontainer(id),
        ),
            await chatController.addChat({
                first_name: name,
                chatId: id,
                chat: false,
            } as ChatTypes);
    });
}