import { Context } from "vm";
import { addressController } from "../../db/controllers/addressController.js";
import { deleteMessage } from "../bot-service/сommand/delete-message.js";
import { ChatTypes } from "../../types/global-types.js";
import { chatController } from "../../db/controllers/chatController.js";
import { deleteNewsletter } from "../bot-service/mailing/mailing.js";

// Обрабатывает callback при нажатии кнопки.
export const callbackQuery = (bot: Context) => {
    bot.on('callback_query', async (query: Context) => {
        const { data } = query.update.callback_query;
        const id = query.from.id;
        const queryInfo = data?.split(':');

        try {
            if (queryInfo[0] === 'Удалить') {
                await addressController.deleteAddress(queryInfo[1], id);
                await deleteMessage(query)
                return;
            }

            if (queryInfo[0] === 'Завершить беседу') {
                await chatController.addChat({ chatId: queryInfo[1], chat: false } as ChatTypes);
                await query.reply(`Чат ${queryInfo[1]} закрыт`);
                return;
            }

            if (queryInfo[0] === 'Заблокировать') {
                await chatController.updateChat({ chatId: queryInfo[1], block: true } as ChatTypes);
                await query.reply(`Пользователь ${queryInfo[1]} заблокирован`);
                return;
            }

            if (queryInfo[0] === 'Разблокировать') {
                await chatController.updateChat({ chatId: queryInfo[1], block: false } as ChatTypes);
                await query.reply(`Пользователь ${queryInfo[1]} разблокирован`);
                return;
            }

            if (queryInfo[0] === 'Удалить рассылку') {
                await deleteNewsletter(query)
                await deleteMessage(query, queryInfo[1])
                await deleteMessage(query)
            }

        } catch (error) {
            console.error(error);
        }
    })

}