export async function sendBroadcast(message, chatIdArr, bot) {
    console.log(1);
    try {
        await Promise.all(chatIdArr.map(async (id) => {
            await bot.telegram.sendMessage(id, message);
        }));
        bot.telegram.sendMessage(process.env.CHAT_ID, 'Рассылка начата!');
    }
    catch (error) {
        console.log(error);
    }
}
//# sourceMappingURL=mailing.js.map