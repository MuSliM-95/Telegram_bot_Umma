import { Context } from "vm";

export async function sendBroadcast(message: string, chatIdArr: string[], bot: Context) {
    try {
        await Promise.all(chatIdArr.map( id => {
             bot.telegram.sendMessage(id, message)
        }))

        bot.telegram.sendMessage(process.env.CHAT_ID!, 'Рассылка начата!');
    } catch (error) {
        console.log(error);
    }

}
