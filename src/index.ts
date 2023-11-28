import express, { Application } from "express"
import { Telegraf } from "telegraf"
import { Context } from "vm";
import {
    adminKeyboard,
    chatblock,
    infoText,
    keyboardСontainer,
    prayerKeyboardСontainer,
    removeImage
} from "./options.js";
import { prayerTime, prayerTimeCity } from "./asyncs/fetch.js";
import rgx from "./hooks/regExp/regExp.js";
import router from "./db/routs/rout.js"
import cors from "cors"
import dotenv from 'dotenv'
import { chatController } from "./db/controllers/chatController.js";
import path from "path";
import { fileURLToPath } from "url";
import { addressController } from "./db/controllers/addressController.js";
import { ChatTypes, Data } from "./types/global.js";
import "./db/index.js"
import { sendBroadcast } from "./hooks/mailing/mailing.js";

dotenv.config()

const app: Application = express();
const PORT = process.env.PORT || 5000




const corsOptions = {
    origin: 'https://umma-maps.ru',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors(corsOptions));
app.use(router)

app.use(express.static(path.join(__dirname, '../src/db/uploads/')))


app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

export const bot = new Telegraf(process.env.TOKEN!)

const start = async () => {
    let newText: string[] | boolean = false

    // Обработка команд
    bot.telegram.setMyCommands([
        { command: "start", description: "start" }
    ])

    bot.start((ctx: Context) => {
        ctx.replyWithHTML(infoText(), ctx?.chat.id == process.env.CHAT_ID! ? adminKeyboard : keyboardСontainer),
        ctx?.chat.id != process.env.CHAT_ID! &&  chatController.addChat({first_name: ctx.update.message.chat.first_name, chatId: ctx.update.message.chat.id, chat: false } as ChatTypes)
    })

    bot.hears("Время молитв", (ctx) => ctx.reply("Выберите действие", prayerKeyboardСontainer))
    bot.hears("На главную", (ctx) => ctx.reply("Выберите действие", ctx?.chat.id.toString() === process.env.CHAT_ID! ? adminKeyboard : keyboardСontainer))
    bot.hears("По названию города", (ctx) => {
        ctx.reply("Введите названия города в таком формате: Египет, Каир")
        newText = true
    })
    bot.on("message", async (ctx: Context) => {
        try {
            const { text } = ctx.update.message;
            const { message_id, photo, caption } = ctx.update.message
            const { id, first_name } = ctx.update.message.chat;
            const replyIdChat = ctx.update.message.reply_to_message?.forward_from?.id
            const timestamp = ctx.update.message.date
            const { location } = ctx.update.message

            console.log(caption);
            

            let chat = await chatController.getChatId(id)

            if (text) {
                var [idAddress, params] = text?.split(":")
            }

            if (id == process.env.CHAT_ID! && idAddress === "Отправить рассылку") {
                const chatIdArr = await chatController.getChat()

                if (chatIdArr && chatIdArr.length > 0) {
                    await sendBroadcast(params, chatIdArr, bot)
                    return
                }
            }

            if (!location && newText) {
                newText = rgx(text)
                await prayerTimeCity(newText as string[], { bot, id })
                newText = false
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
                await ctx.reply("Вам скора ответят, по воле Аллаха")
                await ctx.telegram.forwardMessage(process.env.CHAT_ID!, id, message_id)
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

            if (id == process.env.CHAT_ID) {
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

        const dataString = JSON.parse(queryInfo[0])
        
        try {
            if (queryInfo[0] === 'Удалить') {
                await addressController.deleteAddress(dataString.id!, { bot, id })
                removeImage(__dirname, `/../src/db/uploads/${dataString.photo.image}` )
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


    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));


}


start()


