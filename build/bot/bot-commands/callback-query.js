import { addressController } from "../../db/controllers/addressController.js";
import { deleteMessage } from "../bot-service/command/delete-message.js";
import { chatController } from "../../db/controllers/chatController.js";
import { deleteNewsletter } from "../bot-service/mailing/mailing.js";
export const callbackQuery = (bot) => {
    bot.on('callback_query', async (query) => {
        const { data } = query.update.callback_query;
        const id = query.from.id;
        const queryInfo = data === null || data === void 0 ? void 0 : data.split(':');
        try {
            if (queryInfo[0] === 'Удалить') {
                await addressController.deleteAddress(queryInfo[1], id);
                await deleteMessage(query);
                return;
            }
            if (queryInfo[0] === 'Завершить беседу') {
                await chatController.addChat({ chatId: queryInfo[1], chat: false });
                await query.reply(`Чат ${queryInfo[1]} закрыт`);
                return;
            }
            if (queryInfo[0] === 'Заблокировать') {
                await chatController.updateChat({ chatId: queryInfo[1], block: true });
                await query.reply(`Пользователь ${queryInfo[1]} заблокирован`);
                return;
            }
            if (queryInfo[0] === 'Разблокировать') {
                await chatController.updateChat({ chatId: queryInfo[1], block: false });
                await query.reply(`Пользователь ${queryInfo[1]} разблокирован`);
                return;
            }
            if (queryInfo[0] === 'Удалить рассылку') {
                await deleteNewsletter(query);
                await deleteMessage(query, queryInfo[1]);
                await deleteMessage(query);
            }
        }
        catch (error) {
            console.error(error);
        }
    });
};
//# sourceMappingURL=callback-query.js.map