import { Context } from "vm";


export async function sendBroadcast(message: string, chatIdArr: string[], bot: Context): Promise<void> {
    try {
        await Promise.all(chatIdArr.map(async id => {
            await bot.telegram.copyMessage(id, process.env.CHAT_ID, message)
        }))

        bot.telegram.sendMessage(process.env.CHAT_ID!, 'Рассылка начата!');
    } catch (error) {
        console.log("Ошибка рассылки");
    }

}
