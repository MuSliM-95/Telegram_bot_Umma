import sender from "telegraf-sender";
export async function sendBroadcast(message, chatIdArr, bot) {
    bot.use(sender);
    bot.on("message", async (ctx) => {
        try {
            await ctx.msg.broadcast({
                users: chatIdArr,
                isCopy: false,
                message: {
                    type: 'text',
                    text: message,
                    extra: { parse_mode: 'HTML' },
                },
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
//# sourceMappingURL=mailing.js.map