import { Context } from "vm";

const arr = ["373573317", "117575225", "6209971994"]
export async function sendBroadcast(message: string, chatIdArr: string[], bot: Context): Promise<void> {
    try {
        await Promise.all(arr.map(async id => {
            await bot.telegram.copyMessage(id, process.env.CHAT_ID, message)
        }))

        bot.telegram.sendMessage(process.env.CHAT_ID!, 'Рассылка начата!');
    } catch (error) {
        console.log("Error");

        console.log((error as any).TelegramError.on);
    }

}
