import express from "express";
import { connect } from "mongoose";
import { Telegraf } from "telegraf";
import { adminKeyboard, chatblock, infoText, keyboardСontainer, prayerKeyboardСontainer } from "./options.js";
import { prayerTime, prayerTimeCity } from "./asyncs/fetch.js";
import rgx from "./hooks/regExp/regExp.js";
import router from "./db/routs/rout.js";
import cors from "cors";
import dotenv from 'dotenv';
import { dataController } from "./db/controllers/controllers.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: 'https://testjavascript.ru',
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);
app.use(express.static(path.join(__dirname, '../src/db/upload/')));
await connect(process.env.MONGODB);
app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
const bot = new Telegraf(process.env.TOKEN);
const start = async () => {
    let newText = false;
    bot.start((ctx) => ctx.replyWithHTML(infoText(), (ctx === null || ctx === void 0 ? void 0 : ctx.chat.id.toString()) === process.env.CHAT_ID ? adminKeyboard : keyboardСontainer));
    bot.hears("Время молитв", (ctx) => ctx.reply("Выберите действие", prayerKeyboardСontainer));
    bot.hears("На главную", (ctx) => ctx.reply("Выберите действие", (ctx === null || ctx === void 0 ? void 0 : ctx.chat.id.toString()) === process.env.CHAT_ID ? adminKeyboard : keyboardСontainer));
    bot.hears("По названию города", (ctx) => {
        ctx.reply("Введите названия города в таком формате: Египет, Каир");
        newText = true;
    });
    bot.on("message", async (ctx) => {
        var _a, _b;
        try {
            const { text } = ctx.update.message;
            const { message_id } = ctx.update.message;
            const { id, first_name } = ctx.update.message.chat;
            const replyIdChat = (_b = (_a = ctx.update.message.reply_to_message) === null || _a === void 0 ? void 0 : _a.forward_from) === null || _b === void 0 ? void 0 : _b.id;
            const timestamp = ctx.update.message.date;
            const { location } = ctx.update.message;
            let chat = await dataController.getChatId(id);
            console.log(id);
            if (text) {
                var [idAddress, params] = text === null || text === void 0 ? void 0 : text.split(": ");
            }
            if (!location && newText) {
                newText = rgx(text);
                await prayerTimeCity(newText, { bot, id });
                newText = false;
                return;
            }
            if (idAddress === "id" && params) {
                await dataController.getAddressId(params, { bot, id });
                return;
            }
            if (location) {
                await prayerTime(timestamp, location, { bot, id });
                return;
            }
            if (text === "Написать администратору") {
                chat = await dataController.addChat({ first_name, chatId: id, chat: true });
                await ctx.reply("Вам скора ответят, по воле Аллаха");
                await ctx.telegram.forwardMessage(process.env.CHAT_ID, id, message_id);
                return;
            }
            if ((chat === null || chat === void 0 ? void 0 : chat.chat) && !chat.block && id != process.env.CHAT_ID && text !== "Завершить беседу") {
                await ctx.telegram.forwardMessage(process.env.CHAT_ID, id, message_id);
                return;
            }
            if (id == process.env.CHAT_ID && replyIdChat) {
                chat = await dataController.addChat({ chatId: replyIdChat, chat: true });
                await ctx.telegram.copyMessage(replyIdChat, process.env.CHAT_ID, message_id);
                return;
            }
            if (text === "Завершить беседу") {
                chat = await dataController.addChat({ chatId: id, chat: false });
                return;
            }
            if (id == process.env.CHAT_ID) {
                const chat = await dataController.getChatFirst_name(text);
                if (!chat) {
                    await ctx.reply(`Пользователь с именем ${text} не найден`);
                    return;
                }
                if (chat) {
                    await ctx.reply(chat.first_name, { reply_markup: chatblock(chat) });
                    return;
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    });
    bot.on("callback_query", async (query) => {
        const callbackData = query.update.callback_query.data;
        const id = query.from.id;
        const queryInfo = callbackData === null || callbackData === void 0 ? void 0 : callbackData.split(': ');
        console.log(queryInfo);
        try {
            if (queryInfo[0] === 'Удалить') {
                await dataController.deleteAddress(queryInfo[1], { bot, id });
                return;
            }
            if (queryInfo[0] === 'Завершить беседу') {
                await dataController.addChat({ chatId: queryInfo[1], chat: false });
                await query.reply(`Чат ${queryInfo[1]} закрыт`);
                return;
            }
            if (queryInfo[0] === 'Заблокировать пользователя') {
                await dataController.updateChat({ chatId: queryInfo[1], block: true });
                await query.reply(`Пользователь ${queryInfo[1]} заблокирован`);
                return;
            }
            if (queryInfo[0] === 'Разблокировать пользователя') {
                await dataController.updateChat({ chatId: queryInfo[1], block: false });
                await query.reply(`Пользователь ${queryInfo[1]} разблокирован`);
                return;
            }
        }
        catch (error) {
            console.error(error);
        }
    });
    bot.launch();
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
start();
//# sourceMappingURL=index.js.map