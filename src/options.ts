import { Markup } from "telegraf";
import { Bot, ChatTypes, Data } from "./types/global.js";
import { fileURLToPath } from 'url';
import path from "path";
import dotenv from 'dotenv'
import { unlink } from "fs";
dotenv.config()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urlButton = [Markup.button.webApp("Добавить место", "https://umma-maps.ru/html/")]
const addressButton = [Markup.button.webApp("Посмотреть адреса", "https://umma-maps.ru/html/maps.html")]
const callback = [Markup.button.callback("Время молитв", "Время молитв")]
const prayerButtonlocation = [Markup.button.locationRequest("По геолокации")]
const prayerButton = [Markup.button.callback("По названию города", "По названию города")]
const backButtonHome = Markup.button.callback("На главную", "")
const openСhat = [Markup.button.text("Написать администратору")]



export const keyboardСontainer =  Markup.keyboard([
    urlButton,
    addressButton,
    callback,
    openСhat,
])

export const adminKeyboard = Markup.keyboard([
    urlButton,
    addressButton,
    callback
])

export const prayerKeyboardСontainer = Markup.keyboard([
    prayerButton,
    prayerButtonlocation,
    [backButtonHome]
]) 

export const chatblock = ({chatId,  block}: ChatTypes) => {
    try {
        const blockUsers = block ? "Разблокировать пользователя" : "Заблокировать пользователя"
        const blockUsersCallbek = block ? "Разблокировать" : "Заблокировать"
        const  keyboard = {
            inline_keyboard: [
                [
                   Markup.button.callback("Завершить беседу", `Завершить беседу:${chatId}`)
                ],
                [
                   Markup.button.callback(blockUsers, `${blockUsersCallbek}:${chatId}`)
                ],
               ]
           } 
           return keyboard
    } catch (error) {
        console.log(error);
        
    }
   
}


const pathImage  = (params?:string) => {
   return { source: path.join(__dirname, `../src/db/uploads/${params || "scale_1200.webp"}`) }
}
const caption = (params: Data) => {
   return `<strong>${params.title}</strong>\n\n<strong>Время работы: ${params.time}</strong>\n\n<strong>${params.region}</strong>\n\n<strong>${params.city}</strong>\n\n<strong>${params.place}</strong>\n\n<strong>${params.prayer}</strong>\n\n`;
}


export const addressInfoAdminChat = async (data: Data, obj: Bot) => {
    const { bot, id } = obj
    const dataString = JSON.stringify(data);
    
    try {
        const inlineKeyboard = {
            inline_keyboard:  [
                [
                    Markup.button.webApp("Открыть в Яндекс картах",
                        `https://yandex.ru/maps/?rtext=~${data.latitude},${data.longitude}`),        
                ],
                [
                    Markup.button.callback(`Удалить`, `Удалить:${dataString}`) 
                ],
            ]
        };

        await bot.telegram.sendPhoto(id, pathImage(data?.photo?.image),
        { caption: caption(data), parse_mode: "HTML", reply_markup: inlineKeyboard  });

         

    } catch (error) {
        console.error("Ошибка при отправке фото:", ( error as Error).message);
    }

}


export const removeImage = (param:string) => {
    console.log(param);
    
    return unlink(path.join(param), (error) => console.log(error));
}

export const infoText = ():string => {
return `
<strong>Ассаляму алейкум уа рахматуЛлахи уа баракатух.</strong>
<em>Bot "Umma places" является помощником для поиска объектов разного назначения как Мечети, Кафе-халяль, Магазины и т.п.

Так же Вы можете добавить ваши личные объекты Вашей деятельности или известные Вам подобные места.

Бот работает в основном с геолокацией, поэтому включите ее у себя заранее в настройках для корректной работы.
</em>
`
}