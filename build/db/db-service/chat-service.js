import Chat from "../models/Chat.js";
export const createChat = async (params) => {
    const { first_name, chatId, chat } = params;
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
        getChat.update({ chat: false });
        await getChat.save();
        return;
    }
    getChat.update({ chat });
    await getChat.save();
    return getChat;
};
export const chatUpdate = async (chatId, block) => {
    const data = await Chat.findOne({ where: { chatId } });
    if (!data) {
        throw new Error("Не предвиденная ошибка, при поиске чата для изменения");
    }
    data.update({ block, chat: false });
    await data.save();
    return data;
    4;
};
//# sourceMappingURL=chat-service.js.map