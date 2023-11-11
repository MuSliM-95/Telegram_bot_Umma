import { Context } from "vm";
import { Data } from "../../types/global.js";
import { bot } from "../../index.js";

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


export  function sendMessageTelegram(data: Data) {
    try {        

        bot.telegram.sendMessage(process.env.CHAT_ID!, `${data.dataValues.id}`)

    } catch (error) {
        
        console.log(error);
    }
}