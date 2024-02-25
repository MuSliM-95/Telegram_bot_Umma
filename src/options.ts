import { Markup } from 'telegraf';
import { Bot, ChatTypes, Data } from './types/global.js';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { unlink } from 'fs';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const callback = [Markup.button.callback('Время молитв', 'Время молитв')];
const prayerButtonlocation = [Markup.button.locationRequest('По геолокации')];
const prayerButton = [Markup.button.callback('По названию города', 'По названию города')];
const backButtonHome = Markup.button.callback('На главную', '');
const openСhat = [Markup.button.text('Написать администратору')];
const info = [Markup.button.text('Получить данные')];

export const keyboardСontainer = (id: string) =>
  Markup.keyboard([
    [Markup.button.webApp('Добавить место', `https://umma-maps.ru/html/index.html?chatId=${id}`)],
    [Markup.button.webApp('Посмотреть адреса', `https://umma-maps.ru/html/maps.html?chatId=${id}`)],
    callback,
    openСhat,
  ]);

export const adminKeyboard = (id: string) =>
  Markup.keyboard([
    [Markup.button.webApp('Добавить место', `https://umma-maps.ru/html/index.html?chatId=${id}`)],
    [Markup.button.webApp('Посмотреть адреса', `https://umma-maps.ru/html/maps.html?chatId=${id}`)],
    callback,
    info,
  ]);


export const closeChat = () => Markup.keyboard([[Markup.button.text('Закрыть чат')]]);

export const prayerKeyboardСontainer = Markup.keyboard([prayerButton, prayerButtonlocation, [backButtonHome]]);

export const chatblock = ({ chatId, block }: ChatTypes) => {
  try {
    const blockUsers = block ? 'Разблокировать пользователя' : 'Заблокировать пользователя';
    const blockUsersCallbek = block ? 'Разблокировать' : 'Заблокировать';
    const keyboard = {
      inline_keyboard: [
        [Markup.button.callback('Завершить беседу', `Завершить беседу:${chatId}`)],
        [Markup.button.callback(blockUsers, `${blockUsersCallbek}:${chatId}`)],
      ],
    };
    return keyboard;
  } catch (error) {
    console.log(error);
  }
};

const pathImage = (params?: string) => {
  return { source: path.join(__dirname, `../src/db/uploads/${params || 'scale_1200.webp'}`) };
};

const caption = (params: Data) => {
  return (
    `<strong>${params.title}</strong>\n\n` +
    `<strong>Время работы: ${params.time}</strong>\n\n` +
    `<strong>Регион: ${params.region === 'undefined' ? 'Не обозначен' : params.region}</strong>\n\n` +
    `<strong>Город: ${params.city}</strong>\n\n<strong>Место: ${params.place}</strong>\n\n` +
    `<strong>Место для молитвы: ${params.prayer}</strong>\n\n` +
    `<strong>id:${params.id}</strong>\n\n` +
    `<em><strong>Описания:</strong> ${params.descriptions !== undefined ? params.descriptions : 'нет'}</em>\n\n`
  );
};

export const addressInfoAdminChat = async (data: Data, obj: Bot) => {
  const { bot, id } = obj;

  try {
    const inlineKeyboard = {
      inline_keyboard: [
        [
          Markup.button.webApp(
            'Открыть в Яндекс картах',
            `https://yandex.ru/maps/?rtext=~${data.latitude},${data.longitude}`,
          ),
        ],
        [Markup.button.callback(`Удалить`, `Удалить:${data.id}`)],
      ],
    };

    await bot.telegram.sendPhoto(id, pathImage(data?.photo?.image), {
      caption: caption(data),
      parse_mode: 'HTML',
      reply_markup: inlineKeyboard,
    });
  } catch (error) {
    console.error('Ошибка при отправке фото:', error);
  }
};

export const addressInfoUserChat = async (data: Data, obj: Bot): Promise<void> => {
  const { bot, id } = obj;

  try {
    const inlineKeyboard = {
      inline_keyboard: [
        [
          Markup.button.webApp(
            'Открыть в Яндекс картах',
            `https://yandex.ru/maps/?rtext=~${data.latitude},${data.longitude}`,
          ),
        ],
      ],
    };

    await bot.telegram.sendPhoto(id, pathImage(data?.photo?.image), {
      caption: caption(data),
      parse_mode: 'HTML',
      reply_markup: inlineKeyboard,
    });
  } catch (error) {
    console.error('Ошибка при отправке фото:', error);
  }
};

export const removeImage = (param: string) => {
  return unlink(param, (error) => console.log(error));
};

export const infoText = (): string => {
  return `
<strong>Ассаляму алейкум уа рахматуЛлахи уа баракатух.</strong>
<em>Bot "Umma places" является помощником для поиска объектов разного назначения как Мечети, Кафе-халяль, Магазины и т.п.

Так же Вы можете добавить ваши личные объекты Вашей деятельности или известные Вам подобные места.

Бот работает в основном с геолокацией, поэтому включите ее у себя заранее в настройках для корректной работы.
</em>
<em>https://t.me/+q3g7zPQgT6VmOWRi</em>
`;
};
