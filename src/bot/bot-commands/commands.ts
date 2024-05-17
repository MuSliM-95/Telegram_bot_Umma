import { Telegraf } from 'telegraf';
import { callbackQuery } from './callback-query.js';
import { myChatMember } from './my-chat-member.js';
import { message } from './message.js';
import { startCommand } from './start-command.js';
import { commandsBlockingInGrups } from './blocking-group-command.js';

export const bot = new Telegraf(process.env.TOKEN!);

export const start = async (): Promise<void> => {

  await bot.telegram.setMyCommands([{ command: 'start', description: 'start' }]);

  // Не позволяет обрабатывать команды в группах
  commandsBlockingInGrups(bot)

  // Обработчик команды старт 
  startCommand(bot)

  // Обработчик основных команд функционала бота.
  message(bot)

  // Обработчик калбеков
  callbackQuery(bot)

  // Обработчик блокировки бота
  myChatMember(bot)


  await bot.launch();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
