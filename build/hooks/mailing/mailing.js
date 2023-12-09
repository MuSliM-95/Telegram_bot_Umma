const arr = ["373573317", "117575225", "6209971994"];
export async function sendBroadcast(message, chatIdArr, bot) {
    try {
        await Promise.all(arr.map(async (id) => {
            await bot.telegram.copyMessage(id, process.env.CHAT_ID, message);
        }));
        bot.telegram.sendMessage(process.env.CHAT_ID, 'Рассылка начата!');
    }
    catch (error) {
        console.log("Error");
        console.log(error.TelegramError.on);
    }
}
//# sourceMappingURL=mailing.js.map