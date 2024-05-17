export const commandsBlockingInGrups = (bot) => {
    bot.use(async (ctx, next) => {
        if (ctx.chat.type !== "private") {
            return await ctx.reply('Извините, я работаю только в приватных чатах.');
        }
        else {
            next();
        }
    });
};
//# sourceMappingURL=blocking-group-command.js.map