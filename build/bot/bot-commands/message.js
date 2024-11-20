import { chatController } from "../../db/controllers/chatController.js";
import rgx from "../bot-service/regExp/regExp.js";
import { prayerTime, prayerTimeCity } from "../bot-asyncs/fetch.js";
import { botCommands } from "../bot-service/command/getData.js";
import { addressController } from "../../db/controllers/addressController.js";
import { adminKeyboard, chatblock, closeChat, keyboardСontainer, prayerKeyboardСontainer } from "../options.js";
import { sendNewsletter } from "../bot-service/mailing/mailing.js";
import { adminCommand } from "../../index.js";
export const message = (bot) => {
    bot.hears('Время молитв', async (ctx) => await ctx.reply('Выберите действие', prayerKeyboardСontainer));
    bot.hears('На главную', async (ctx) => {
        const id = ctx.update.message.chat.id;
        await ctx.reply('Выберите действие', id == process.env.CHAT_ID ? adminKeyboard(id) : keyboardСontainer(id));
    });
    bot.on('message', async (ctx) => {
        var _a, _b;
        try {
            const message = ctx.update.message;
            const { message_id, photo, caption, text, location } = message;
            const { id, first_name } = message === null || message === void 0 ? void 0 : message.from;
            const replyIdChat = (_b = (_a = ctx.update.message.reply_to_message) === null || _a === void 0 ? void 0 : _a.forward_from) === null || _b === void 0 ? void 0 : _b.id;
            const timestamp = ctx.update.message.date;
            let chat = await chatController.getChatId(id);
            if (text) {
                var [idAddress, params] = text === null || text === void 0 ? void 0 : text.split(':');
            }
            if (text === 'По названию города') {
                await ctx.reply("Введите названия города в таком формате: 'Время: Россия, Грозный'");
                return;
            }
            if (!location && idAddress === 'Время') {
                const messagePrayer = rgx(params);
                await prayerTimeCity(ctx, messagePrayer);
                botCommands.prayer_counter.name++;
                return;
            }
            if (id == process.env.CHAT_ID && text === 'Получить данные') {
                await addressController.getInfo();
                return;
            }
            if (idAddress === 'id' && params && id == process.env.CHAT_ID) {
                await addressController.getAddressId(params, id);
                return;
            }
            if (location) {
                await prayerTime(ctx, timestamp, location);
                botCommands.prayer_counter.geolocation++;
                return;
            }
            if (text === 'Написать администратору') {
                chat = await chatController.addChat({ first_name, chatId: id, chat: true });
                await ctx.reply(`Вам скоро ответят, по воле Аллаха. Также, у нас есть группа, вы можете задать вопрос и там.\nhttps://t.me/+q3g7zPQgT6VmOWRi`, closeChat());
                await ctx.telegram.forwardMessage(process.env.CHAT_ID, id, message_id);
                return;
            }
            if (text === 'Закрыть чат') {
                await chatController.addChat({ chatId: id, chat: false });
                await ctx.reply('Чат закрыт', keyboardСontainer(id));
                await bot.telegram.sendMessage(process.env.CHAT_ID, `Пользователь ${first_name} завершил беседу`, keyboardСontainer(id));
                return;
            }
            if ((chat === null || chat === void 0 ? void 0 : chat.chat) && !chat.block && id != process.env.CHAT_ID) {
                await ctx.telegram.forwardMessage(process.env.CHAT_ID, id, message_id);
                return;
            }
            if (id == process.env.CHAT_ID && replyIdChat) {
                chat = await chatController.addChat({ chatId: replyIdChat, chat: true });
                await ctx.telegram.copyMessage(replyIdChat, process.env.CHAT_ID, message_id);
                return;
            }
            if (text === 'Начать рассылку') {
                adminCommand.newsletter = true;
                return;
            }
            if (adminCommand.newsletter && id == process.env.CHAT_ID) {
                await sendNewsletter(message_id, ctx);
                adminCommand.newsletter = false;
                return;
            }
            if (id == process.env.CHAT_ID && !replyIdChat && adminCommand.chat) {
                const chat = await chatController.getChatFirst_name(text);
                if (!chat && !photo) {
                    return ctx.reply(`Пользователь с именем ${text} не найден`);
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
};
//# sourceMappingURL=message.js.map