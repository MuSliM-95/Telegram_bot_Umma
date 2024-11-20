import { BadRequest } from "../../bot/exceptions/api-error.js";
import { chatUpdate, createChat } from "../db-service/chat-service.js";
import Chat from "../models/Chat.js";
export const chatController = {
    getChat: async () => {
        try {
            const chatId = await Chat.findAll({
                attributes: ['chatId']
            });
            const id = chatId.map(el => el.chatId);
            return id;
        }
        catch (error) {
            console.log('getChat');
            throw await BadRequest(error);
        }
    },
    addChat: async (chatParams) => {
        try {
            const chat = await createChat(chatParams);
            return chat;
        }
        catch (error) {
            console.log('addChat');
            throw await BadRequest(error);
        }
    },
    getChatId: async (chatId) => {
        try {
            const data = await Chat.findOne({ where: { chatId } });
            if (!data) {
                throw new Error("Ошибка при поиске чата!");
            }
            return data;
        }
        catch (error) {
            console.log('getChatId');
            throw await BadRequest(error);
        }
    },
    getChatFirst_name: async (first_name) => {
        try {
            const data = await Chat.findOne({ where: { first_name } });
            if (!data) {
                throw new Error("Не предвиденная ошибка при работе с чатом");
            }
            return data;
        }
        catch (error) {
            console.log('getChatFirst_name');
            throw await BadRequest(error);
        }
    },
    updateChat: async ({ chatId, block }) => {
        try {
            const data = await chatUpdate(chatId, block);
            return data.block;
        }
        catch (error) {
            console.log('updateChat');
            throw await BadRequest(error);
        }
    },
    chatRemove: async (chatId) => {
        try {
            await Chat.destroy({
                where: {
                    chatId
                }
            });
        }
        catch (error) {
            console.log('chatRemove');
            throw await BadRequest(error);
        }
    }
};
//# sourceMappingURL=chatController.js.map