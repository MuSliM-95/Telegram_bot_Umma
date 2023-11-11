import { bot } from "../../index.js";
export async function sendBroadcast(message, chatIdArr, bot) {
    try {
        await Promise.all(chatIdArr.map(id => {
            bot.telegram.sendMessage(id, message);
        }));
        bot.telegram.sendMessage(process.env.CHAT_ID, 'Рассылка начата!');
    }
    catch (error) {
        console.log(error);
    }
}
export function sendMessageTelegram(data) {
    try {
        bot.telegram.sendMessage(process.env.CHAT_ID, `${data.dataValues.id}`);
    }
    catch (error) {
        console.log(error);
    }
}
//# sourceMappingURL=mailing.js.map