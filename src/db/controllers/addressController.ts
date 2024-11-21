import { NextFunction, Request } from 'express';
import { Response } from 'express';
import { addressInfoAdminChat } from '../../bot/options.js';
import Address from '../models/Address.js';
import Chat from '../models/Chat.js';
import { bot } from '../../bot/bot-commands/commands.js';
import { addMessageInChat, addressUpdate, createAddress, filterAddresses, removeImageInUploads, sendMessages } from '../db-service/address-service.js';
import { BadRequest } from '../../bot/exceptions/api-error.js';

export const addressController = {
  postData: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await createAddress(req, res, next)
      res.json('Данные сохранены');  
  },

  getAddresses: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await Address.findAll();
      const address = filterAddresses(data, req)

      res.json(address);
    } catch (error) {
      next(error)
    }
  },

  getAddressId: async (Id: string, chatId: string): Promise<void> => {
    try {
      const data = await Address.findOne({ where: { id: Id } });
      if (!data) {
        await bot.telegram.sendMessage(process.env.CHAT_ID!, "Адрес не найден")
        return
      }
      await addressInfoAdminChat(data, chatId);
    } catch (error) {
      throw await BadRequest(error as Error)
    }
  },

  getClientInfo: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { addressId, chatId } = req.params;
    try {
      const data = await Address.findOne({ where: { id: addressId } });
      if (!data) {
        throw new Error(`Не предвиденная ошибка при получении данных об адресе`)
      }

      res.json(data)

      if (chatId) {
        addMessageInChat(data, chatId)
      }

    } catch (error) {
      next(error)
    }
  },

  deleteAddress: async (addressId: string, ChatId: string): Promise<void> => {
    try {
      const address = await Address.findOne({ where: { id: addressId } });
      if (!address) {
        throw new Error("Не предвиденная ошибка при попытке удалить адрес. Возможно адрес был ране вами удален.")
      }

      removeImageInUploads(address)
      await address.destroy()
      await bot.telegram.sendMessage(ChatId, 'Адрес удален');

    } catch (error) {
      throw await BadRequest(error as Error)
    }
  },

  updateAddress: async (req: Request, res: Response, next: NextFunction): Promise<void> => {

      const { chatId, addressId } = req.params
  
      const address = await addressUpdate(req, res, next)
  
      await addressInfoAdminChat(address!, chatId);
  
  },
  

  getInfo: async (): Promise<void> => {
    try {
      const address = await Address.findAll();
      const users = await Chat.findAll();

      await sendMessages(address, users)
    } catch (error) {
      throw await BadRequest(error as Error)
    }
  },
};
