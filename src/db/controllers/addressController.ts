import { Request } from 'express';
import { Response } from 'express';
import { addressInfoAdminChat, addressInfoUserChat, removeImage } from '../../options.js';
import { Bot, UpdateAddress } from '../../types/global.js';
import { updatePhoto } from '../middleWares/upload.js';
import dotenv from 'dotenv';
import Address from '../models/Address.js';
import Chat from '../models/Chat.js';
import { readingFs } from '../../hooks/readingFiles/readingFiles.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { bot } from '../../botCommands/commands.js';
import { botCommands } from '../../hooks/сommand/getData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addressController = {
  postData: async (req: Request, res: Response): Promise<void> => {
    const chatId = req.params.chatId;

    const { textarea, name, region, place, city, prayer, address, location, time } = req.body;
    const coordinates = location.split(',');
    const photo = req.file;
    try {
      const data = await Address.create({
        title: name,
        descriptions: textarea || '',
        region,
        city,
        place,
        prayer,
        photo: {
          image: photo?.filename || '',
        },
        address,
        latitude: coordinates[0],
        longitude: coordinates[1],
        time,
      });
      if (chatId && process.env.CHAT_ID !== chatId) {
        addressInfoAdminChat(data, { bot, id: chatId as string });
      }
      addressInfoAdminChat(data, { bot, id: process.env.CHAT_ID! });
      
      botCommands.add_address_counter++
      res.json('Данные сохранены');
    } catch (error) {
      console.log((error as Error).message);
    }
  },

  getAddresses: async (req: Request, res: Response): Promise<void> => {
    const location = JSON.parse(req.params.jsonLocation);
    const { topLeft, bottomRight } = location;

    try {
      const data = await Address.findAll();

      const filterAddresses = data.filter((address) => {
        if (
          address?.latitude >= topLeft[0] &&
          address?.latitude <= bottomRight[0] &&
          address?.longitude >= topLeft[1] &&
          address?.longitude <= bottomRight[1]
        ) {
          return address;
        }
      });

      res.json(filterAddresses);
    } catch (error) {
      console.log((error as Error).message);
    }
  },

  getAddressId: async (Id: string, obj: Bot): Promise<void> => {
    const { id, bot } = obj;
    try {
      const data = await Address.findOne({ where: { id: Id } });

      if (data) {
        await addressInfoAdminChat(data, obj);
      } else {
        await bot.telegram.sendMessage(id, 'Адрес не найден');
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  },

  getClientInfo: async (req: Request, res: Response): Promise<void> => {
    const { chatId, addressId } = req.params;
    try {
      const data = await Address.findOne({ where: { id: addressId } });

      if (data) {
        if (process.env.CHAT_ID !== chatId) {
          addressInfoUserChat(data, { bot, id: chatId });
        } else {
          addressInfoAdminChat(data, { bot, id: chatId });
        }
        botCommands.maps_counter++
      }
      res.json('Закрыть браузер');
    } catch (error) {
      console.log((error as Error).message);
    }
  },

  deleteAddress: async (addressId: string, obj: Bot): Promise<void> => {
    const { id, bot } = obj;
    try {
      const address = await Address.findOne({ where: { id: addressId } });
      const deletionAddress = await Address.destroy({ where: { id: addressId } });

      console.log(address, deletionAddress);

      if (deletionAddress && address) {
        const pathUploads = path.join(__dirname, `../../../src/db/uploads/${address?.photo.image}`);
        const file = readingFs(pathUploads);
        if (file) {
          removeImage(pathUploads);
        }
        await bot.telegram.sendMessage(id, 'Адрес удален');
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  },

  updateAddress: async (params: UpdateAddress): Promise<void> => {
    const { chatId, photo, botObj } = params;
    const addressId = chatId.split(': ')[1];
    await updatePhoto(params);

    try {
      const data = await Address.findOne({ where: { id: addressId } });
      data?.update({
        photo: {
          image: `${photo[photo.length - 1].file_id}.png` || '',
        },
      });
      await data?.save();

      if (data) {
        await addressInfoAdminChat(data, botObj);
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  },

  getInfo: async ({ bot }: Bot): Promise<void> => {
    try {
      const address = await Address.findAll();
      const users = await Chat.findAll();

      await bot.telegram.sendMessage(
        process.env.CHAT_ID!,
        `Адреса: ${address.length}\n\nПользователей: ${users.length}\n\nДобавили адрес: ${botCommands.add_address_counter}\n
Получили адрес в чат: ${botCommands.maps_counter}\n\nВремя молитвы, по геолокации: ${botCommands.prayer_counter.geolocation}\n
Время молитвы, по названию города: ${botCommands.prayer_counter.name}`,
      );
    } catch (error) {
      console.log((error as Error).message);
    }
  },
};
