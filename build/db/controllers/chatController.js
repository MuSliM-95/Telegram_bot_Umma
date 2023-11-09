import Chat from "../models/Chat.js";
export const chatController = {
    getChat: async () => {
        try {
            const chatId = await Chat.findAll({
                attributes: ['chatId']
            });
            const id = chatId === null || chatId === void 0 ? void 0 : chatId.map(el => el.chatId);
            return id;
        }
        catch (error) {
            console.log(error.message);
        }
    },
    addChat: async ({ first_name, chatId, chat }) => {
        try {
            const getChat = await Chat.findOne({ where: { chatId } });
            if (!getChat) {
                const data = await Chat.create({
                    first_name,
                    chatId,
                    chat,
                    block: false
                });
                return data;
            }
            if (getChat.block) {
                getChat === null || getChat === void 0 ? void 0 : getChat.update({ chat: false });
                await getChat.save();
                return;
            }
            getChat === null || getChat === void 0 ? void 0 : getChat.update({ chat });
            await getChat.save();
            if (getChat) {
                return getChat;
            }
        }
        catch (error) {
            console.log(error.message);
        }
    },
    getChatId: async (chatId) => {
        try {
            const data = await Chat.findOne({ where: { chatId } });
            if (data) {
                return data;
            }
        }
        catch (error) {
            console.log(error.message);
        }
    },
    getChatFirst_name: async (first_name) => {
        try {
            const data = await Chat.findOne({ where: { first_name } });
            if (data) {
                return data;
            }
        }
        catch (error) {
            console.log(error.message.toString());
        }
    },
    updateChat: async ({ chatId, block }) => {
        try {
            const data = await Chat.findOne({ where: { chatId } });
            data === null || data === void 0 ? void 0 : data.update({ block, chat: false });
            await (data === null || data === void 0 ? void 0 : data.save());
            if (data) {
                return data === null || data === void 0 ? void 0 : data.block;
            }
        }
        catch (error) {
            console.log(error.message);
        }
    },
};
//# sourceMappingURL=chatController.js.map