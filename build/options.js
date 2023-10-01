import { Markup } from "telegraf";
import { fileURLToPath } from 'url';
import path from "path";
import dotenv from 'dotenv';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const urlButton = [Markup.button.webApp("Добавить место", "https://testjavascript.ru/UmmaClient/html")];
const addressButton = [Markup.button.webApp("Посмотреть адреса", "https://testjavascript.ru/UmmaClient/html/maps.html")];
const callback = [Markup.button.callback("Время молитв", "Время молитв")];
const prayerButtonlocation = [Markup.button.locationRequest("По геолокации")];
const prayerButton = [Markup.button.callback("По названию города", "По названию города")];
const backButtonHome = Markup.button.callback("На главную", "");
const openСhat = [Markup.button.text("Написать администратору")];
export const keyboardСontainer = Markup.keyboard([
    urlButton,
    addressButton,
    callback,
    openСhat,
]);
export const adminKeyboard = Markup.keyboard([
    urlButton,
    addressButton,
    callback
]);
export const prayerKeyboardСontainer = Markup.keyboard([
    prayerButton,
    prayerButtonlocation,
    [backButtonHome]
]);
export const chatblock = ({ chatId, block }) => {
    try {
        const blockUsers = block ? "Разблокировать пользователя" : "Заблокировать пользователя";
        const blockUsersCallbek = block ? "Разблокировать" : "Заблокировать";
        console.log(chatId);
        const keyboard = {
            inline_keyboard: [
                [
                    Markup.button.callback("Завершить беседу", `Завершить беседу: ${chatId}`)
                ],
                [
                    Markup.button.callback(blockUsers, `${blockUsersCallbek}: ${chatId}`)
                ],
            ]
        };
        return keyboard;
    }
    catch (error) {
        console.log(error);
    }
};
const pathImage = (params) => {
    return { source: path.join(__dirname, `../src/db/upload/${params || "scale_1200.webp"}`) };
};
const caption = (params) => {
    return `<strong>${params.title}</strong>\n\n<strong>${params.region}</strong>\n\n<strong>${params.city}</strong>\n\n<strong>${params.place}</strong>\n\n<strong>${params.prayer}</strong>\n\n`;
};
export const addressInfoAdminChat = async (data, obj) => {
    var _a;
    const { bot } = obj;
    try {
        const inlineKeyboard = {
            inline_keyboard: [
                [
                    Markup.button.webApp("Открыть в Яндекс картах", `https://yandex.ru/maps/?rtext=~${data.location[0]},${data.location[1]}`),
                ],
                [
                    Markup.button.callback(`Удалить`, `Удалить: ${data === null || data === void 0 ? void 0 : data._id}`)
                ]
            ]
        };
        await bot.telegram.sendPhoto(process.env.CHAT_ID, pathImage((_a = data === null || data === void 0 ? void 0 : data.photo) === null || _a === void 0 ? void 0 : _a.image), { caption: caption(data), parse_mode: "HTML", reply_markup: inlineKeyboard });
    }
    catch (error) {
        console.error("Ошибка при отправке фото:", error);
    }
};
export const infoText = () => {
    return `
<strong>Ассаляму алейкум уа рахматуЛлахи уа баракатух.</strong>
<em>Это бот предназначен для того, чтобы помочь мусульманам в дороге найти дозволенные места.
Вы можете добавить места, которые вам показались интересными, главное, чтобы не было харамных мест.
Чтобы бот работал корректно, проверьте настройки геолокации для построения маршрута, также рекомендуем скачать Яндекс карты</em>
`;
};
//# sourceMappingURL=options.js.map