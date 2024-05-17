import { Telegraf } from 'telegraf';
import { callbackQuery } from './callback-query.js';
import { myChatMember } from './my-chat-member.js';
import { message } from './message.js';
import { startCommand } from './start-command.js';
import { commandsBlockingInGrups } from './blocking-group-command.js';
export const bot = new Telegraf(process.env.TOKEN);
export const start = async () => {
    await bot.telegram.setMyCommands([{ command: 'start', description: 'start' }]);
    commandsBlockingInGrups(bot);
    startCommand(bot);
    message(bot);
    callbackQuery(bot);
    myChatMember(bot);
    await bot.launch();
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
//# sourceMappingURL=commands.js.map