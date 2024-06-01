import { Context } from "vm";
import { chatController } from "../../../db/controllers/chatController.js";
import { deleteMailingList } from "../../options.js";
import { adminCommand } from "../../../index.js";
import { bot } from "../../bot-commands/commands.js";
import { BadRequest } from "../../exceptions/api-error.js";

interface Message_Id {
    message_id: string
}

interface ErrorCopyMessage {
    on: {
        payload: {
            chat_id: string

        }
    }

}

export interface MessageData {
    messageidArr: Array<Message_Id | undefined>
}

export const sendNewsletter = async (message: string, ctx: Context, index: number = 0): Promise<void> => {
    try {
        const chatIdArr = await chatController.getChat();

        if (!chatIdArr || chatIdArr.length < 0) {
            return
        }

        if (index === 0) {
            adminCommand.message_ID = await ctx.reply('Рассылка начата!');
            adminCommand.messageidArr = []
        }

        const id = chatIdArr[index]

        if (index < chatIdArr.length) {
            const messageid = await ctx.copyMessage(id, process.env.CHAT_ID, message)
            adminCommand.messageidArr[index] = messageid
            return sendNewsletter(message, ctx, index + 1)
        }

        adminCommand.newsletter = false
        await ctx.reply('Рассылка окончена. Функция рассылки отключена!', { reply_markup: deleteMailingList(adminCommand.message_ID!.message_id) });
    } catch (error) {
        const err = error as ErrorCopyMessage
        const chat_id = err.on?.payload.chat_id
        // console.log(err);
        return sendNewsletter(message, ctx, index + 1)
        // throw await BadRequest(error as Error)

        // await chatController.chatRemove(id);

    }

}

export const deleteNewsletter = async (ctx: Context, index: number = 0): Promise<void> => {
    try {
        const chatIdArr = await chatController.getChat();
        if (!chatIdArr || chatIdArr.length < 0) {
            return
        }

        const id = chatIdArr[index]

        if (index < chatIdArr.length) {
            await bot.telegram.deleteMessage(id, +adminCommand.messageidArr[index]?.message_id!)
            return deleteNewsletter(ctx, index + 1)

        }

        adminCommand.messageidArr = []
        await ctx.reply('Рассылка успешна удалена!');
    } catch (error) {
        const err = error as ErrorCopyMessage
        const chat_id = err.on.payload.chat_id
        console.log(chat_id);
        return deleteNewsletter(ctx, index + 1)
        // throw await BadRequest(error as Error)
    }
}


