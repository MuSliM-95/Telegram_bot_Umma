import { Markup } from 'telegraf';
import { ChatTypes, Data } from '../types/global-types.js';
import path from 'path';
import { bot } from './bot-commands/commands.js';
import { __dirname } from '../index.js';
import { readingFs } from './bot-service/readingFiles/readingFiles.js';

const callback = Markup.button.callback('Время молитв', 'Время молитв');
const prayerButtonlocation = [Markup.button.locationRequest('По геолокации')];
const prayerButton = [Markup.button.callback('По названию города', 'По названию города')];
const backButtonHome = Markup.button.callback('На главную', '');
const openСhat = [Markup.button.text('Написать администратору')];
const info = Markup.button.text('Получить данные');
const messageAllUsers = Markup.button.text('Начать рассылку')

export const keyboardСontainer = (id: string) =>
  Markup.keyboard([
    [Markup.button.webApp('Добавить место', `${process.env.URL}/html/index.html?chatId=${id}`),
    Markup.button.webApp('Посмотреть адреса', `${process.env.URL}/html/maps.html?chatId=${id}`)],
    [callback],
    openСhat,
  ]).resize();

export const adminKeyboard = (id: string) =>
  Markup.keyboard([
    [Markup.button.webApp('Добавить место', `${process.env.URL}/html/index.html?chatId=${id}`),
    Markup.button.webApp('Посмотреть адреса', `${process.env.URL}/html/maps.html?chatId=${id}`)],
    [messageAllUsers, callback],
    [info]

  ]).resize();


export const closeChat = () => Markup.keyboard([[Markup.button.text('Закрыть чат')]]).resize();

export const prayerKeyboardСontainer = Markup.keyboard([prayerButton, prayerButtonlocation, [backButtonHome]]).resize();

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

const pathImage = (params: string) => {
  return { source: path.join(__dirname, `../src/db/uploads/${params}`) };
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

export const addressInfoAdminChat = async (data: Data, id: string): Promise<void> => {
  try {
    const inlineKeyboard = {
      inline_keyboard: [
        [
          Markup.button.webApp(
            'Yandex maps',
            `https://yandex.ru/maps/?rtext=~${data?.latitude},${data?.longitude}`,
          ),
          Markup.button.webApp(
            'Google maps',
            `https://www.google.com/maps?daddr=${data?.latitude},${data?.longitude}`,
          ),
        ],
        [
          Markup.button.webApp(`Открыть`, `${process.env.URL}/html/address.html?address=${data.id}`),
          Markup.button.webApp(`Изменить`, `${process.env.URL}/html/update-address.html?data=${id}&data=${data.id}`)
        ],
        [Markup.button.callback(`Удалить`, `Удалить:${data.id}`)],

      ],
    };

    const image = readingFs(data)

    await bot.telegram.sendPhoto(id, pathImage(image), {
      caption: caption(data),
      parse_mode: 'HTML',
      reply_markup: inlineKeyboard,
    });


  } catch (error) {
    console.error('Ошибка при отправке фото:', error);
  }
};

export const addressInfoUserChat = async (data: Data, id: string): Promise<void> => {
  try {
    const inlineKeyboard = {
      inline_keyboard: [
        [
          Markup.button.webApp(
            'Yandex maps',
            `https://yandex.ru/maps/?rtext=~${data?.latitude},${data?.longitude}`,
          ),
          Markup.button.webApp(
            'Google maps',
            `https://www.google.com/maps?daddr=${data?.latitude},${data?.longitude}`,
          ),
        ],
        [
          Markup.button.webApp(`Открыть`, `${process.env.URL}/html/address.html?address=${data.id}`),
        ],
      ],
    };

    const image = readingFs(data)

    await bot.telegram.sendPhoto(id, pathImage(image), {
      caption: caption(data),
      parse_mode: 'HTML',
      reply_markup: inlineKeyboard,
    });


  } catch (error) {
    console.error('Ошибка при отправке фото:', error);
  }
};


export const deleteMailingList = (message_id: string) => {
  const inlineKeyboard = {
    inline_keyboard: [
      [Markup.button.callback('Удалить  рассылку', `Удалить рассылку:${message_id}`)]
    ]
  }
  return inlineKeyboard
}


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
