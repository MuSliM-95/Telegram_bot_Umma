import { Telegraf } from "telegraf"
import { Context } from "vm"
import { adminKeyboard, chatblock, closeChat, infoText, keyboardСontainer, prayerKeyboardСontainer, removeImage } from "../options.js"
import { chatController } from "../db/controllers/chatController.js"
import { ChatTypes } from "../types/global.js"
import { sendBroadcast } from "../hooks/mailing/mailing.js"
import { addressController } from "../db/controllers/addressController.js"
import { prayerTime, prayerTimeCity } from "../asyncs/fetch.js"
import rgx from "../hooks/regExp/regExp.js"



export const start = async (bot: Telegraf): Promise<void> => {
    // Обработка команд

    bot.telegram.setMyCommands([
        { command: "start", description: "start" }
    ])

    bot.start((ctx: Context) => {
        ctx.replyWithHTML(infoText(), ctx?.chat.id == process.env.CHAT_ID! ? adminKeyboard(ctx?.chat.id) : keyboardСontainer(ctx?.chat.id)),
            ctx?.chat.id != process.env.CHAT_ID! && chatController.addChat({ first_name: ctx.update.message.chat.first_name, chatId: ctx.update.message.chat.id, chat: false } as ChatTypes)
    })

    bot.hears("Время молитв", (ctx) => ctx.reply("Выберите действие", prayerKeyboardСontainer))
    bot.hears("На главную", (ctx: Context) => ctx.reply("Выберите действие", ctx?.chat.id == process.env.CHAT_ID! ? adminKeyboard(ctx?.chat.id) : keyboardСontainer(ctx?.chat.id)))
    bot.on("message", async (ctx: Context) => {
        try {
            const message = ctx.update.message;
            const { message_id, photo, caption, text, location } = message
            const { id, first_name } = message?.from;
            const replyIdChat = ctx.update.message.reply_to_message?.forward_from?.id
            const timestamp = ctx.update.message.date

            let chat = await chatController.getChatId(id)

            if (text) {
                var [idAddress, params] = text?.split(":")
            }

            if (text === "По названию города") {
                ctx.reply("Введите названия города в таком формате: 'Время: Россия, Грозный'")
                return
            }

            if (!location && idAddress === "Время") {
                const messagePrayer = rgx(params)
                await prayerTimeCity(messagePrayer as string[], { bot, id })
                return
            }

            if (id == process.env.CHAT_ID! && idAddress === "Umma places") {
                const chatIdArr = await chatController.getChat()

                if (chatIdArr && chatIdArr.length > 0) {
                    await sendBroadcast(message_id, chatIdArr, bot)
                    return
                }
            }

            if (id == process.env.CHAT_ID && text === "Получить данные") {
                await addressController.getInfo({ bot, id })
                return
            }


            if (idAddress === "id" && params && id == process.env.CHAT_ID) {
                await addressController.getAddressId(params, { bot, id })
                return
            }


            if (location) {
                await prayerTime(timestamp, location, { bot, id })
                return
            }

            if (text === "Написать администратору") {
                chat = await chatController.addChat({ first_name, chatId: id, chat: true } as ChatTypes)
                await ctx.reply("Вам скора ответят, по воле Аллаха", closeChat())
                await ctx.telegram.forwardMessage(process.env.CHAT_ID!, id, message_id)
                return
            }

            if (text === "Закрыть чат") {
                await chatController.addChat({ chatId: id, chat: false } as ChatTypes)
                await ctx.reply("Чат закрыт", keyboardСontainer(id))
                await bot.telegram.sendMessage(process.env.CHAT_ID!, `Пользователь ${first_name} завершил беседу`, keyboardСontainer(id))
                return
            }

            if (chat?.chat && !chat.block && id != process.env.CHAT_ID) {
                await ctx.telegram.forwardMessage(process.env.CHAT_ID!, id, message_id)
                return
            }

            if (id == process.env.CHAT_ID && replyIdChat) {
                chat = await chatController.addChat({ chatId: replyIdChat, chat: true } as ChatTypes)
                await ctx.telegram.copyMessage(replyIdChat, process.env.CHAT_ID!, message_id)
                return
            }

            if (id == process.env.CHAT_ID && photo && caption) {
                await addressController.updateAddress(params = { chatId: caption, photo, botObj: { bot, id } })
                return
            }

            if (id == process.env.CHAT_ID && !replyIdChat) {
                const chat = await chatController.getChatFirst_name(text)

                if (!chat && !photo) {
                    return ctx.reply(`Пользователь с именем ${text} не найден`)

                }

                if (chat) {
                    await ctx.reply(chat.first_name, { reply_markup: chatblock(chat) })
                    return
                }
            }
        } catch (error) {
            console.error(error)
        }

    })

    bot.on("callback_query", async (query: Context) => {
        const callbackData = query.update.callback_query.data;
        const id = query.from.id
        const queryInfo = callbackData?.split(':')
   
        try {
            if (queryInfo[0] === 'Удалить') {
                await addressController.deleteAddress(queryInfo[1], { bot, id })
                return
            }

            if (queryInfo[0] === 'Завершить беседу') {
                await chatController.addChat({ chatId: queryInfo[1], chat: false } as ChatTypes)
                await query.reply(`Чат ${queryInfo[1]} закрыт`)
                return
            }

            if (queryInfo[0] === 'Заблокировать') {
                await chatController.updateChat({ chatId: queryInfo[1], block: true } as ChatTypes)
                await query.reply(`Пользователь ${queryInfo[1]} заблокирован`)
                return
            }

            if (queryInfo[0] === 'Разблокировать') {
                await chatController.updateChat({ chatId: queryInfo[1], block: false } as ChatTypes)
                await query.reply(`Пользователь ${queryInfo[1]} разблокирован`)
                return
            }
        } catch (error) {
            console.error(error)
        }

    })

    bot.on('my_chat_member', async (ctx: Context) => {

        const chatInfo = ctx.update.my_chat_member
        const { status } = chatInfo.new_chat_member
        const { id } = chatInfo.chat

        if (status === "kicked") {
            await chatController.chatRemove(id)
        }
    });

    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));


}