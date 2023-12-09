import { Request } from "express";
import { Response } from 'express';
import { addressInfoAdminChat, addressInfoUserChat } from "../../options.js";
import { Bot, UpdateAddress } from "../../types/global.js";
import { updatePhoto } from "../middleWares/upload.js";
import dotenv from 'dotenv'
import Address from "../models/Address.js";
import { bot } from "../../index.js";
import Chat from "../models/Chat.js";


dotenv.config()

export const addressController = {
  postData: async (req: Request, res: Response): Promise<void> => {

    const chatId = req.params.chatId;

    const { textarea, name, region, place, city, prayer, address, location, time } = req.body
    const coordinates = location.split(",")
    const photo = req.file
    try {
      const data = await Address.create({
        title: name,
        descriptions: textarea || "",
        region,
        city,
        place,
        prayer,
        photo: {
          image: photo?.filename || "",
        },
        address,
        latitude: coordinates[0],
        longitude: coordinates[1],
        time,
      })
      if (chatId && process.env.CHAT_ID !== chatId) {
        addressInfoAdminChat(data, { bot, id: chatId as string })
      }
      addressInfoAdminChat(data, { bot, id: process.env.CHAT_ID! })


      res.json("Данные сохранены")
    } catch (error) {
      console.log((error as Error).message);

    }
  },

  getAddresses: async (req: Request, res: Response): Promise<void> => {
    const location = JSON.parse(req.params.jsonLocation)
    const { topLeft, bottomRight } = location

    try {
      const data = await Address.findAll()

      const filterAddresses = data.filter(address => {
        if (address?.latitude >= topLeft[0] && address?.latitude <= bottomRight[0]
          && address?.longitude >= topLeft[1] && address?.longitude <= bottomRight[1]) {
          return address
        }
      })

      res.json(filterAddresses)

    } catch (error) {
      console.log((error as Error).message);
    }
  },


  getAddressId: async (Id: string, obj: Bot): Promise<void> => {
    const { id, bot } = obj
    try {
      const data = await Address.findOne({ where: { id: Id } })

      if (data) {
        await addressInfoAdminChat(data, obj)
      } else {
        await bot.telegram.sendMessage(id, "Адрес не найден")

      }

    } catch (error) {
      console.log((error as Error).message);
    }
  },

  getClientInfo: async (req: Request, res: Response): Promise<void> => {
    const { chatId, addressId } = req.params
    try {
      const data = await Address.findOne({ where: { id: addressId } })

      if (data) {
        if (process.env.CHAT_ID !== chatId) {
          addressInfoUserChat(data, { bot, id: chatId })
        } else {
          addressInfoAdminChat(data, { bot, id: chatId })
        }
      }
      res.json("Закрыть браузер")

    } catch (error) {
      console.log((error as Error).message);
    }

  },

  deleteAddress: async (addressId: string, obj: Bot): Promise<void> => {
    const { id, bot } = obj
    try {
      const data = await Address.destroy({ where: { id: addressId } })

      if (data) {
        await bot.telegram.sendMessage(id, "Адрес удален")
      }

    } catch (error) {
      console.log((error as Error).message);
    }
  },

  updateAddress: async (params: UpdateAddress): Promise<void> => {
    const { chatId, photo, botObj } = params
    const addressId = chatId.split(": ")[1]
    await updatePhoto(params)

    try {
      const data = await Address.findOne({ where: { id: addressId } })
      data?.update(
        {
          photo: {
            image: `${photo[photo.length - 1].file_id}.png` || "",
          }
        }
      )
      await data?.save()

      if (data) {
        await addressInfoAdminChat(data, botObj)
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  },

  getInfo: async ({ bot }: Bot): Promise<void> => {
    try {
      const address = await Address.findAll()
      const users = await Chat.findAll()
 
      await bot.telegram.sendMessage(process.env.CHAT_ID!, `Адреса: ${address.length}\n\nПользователей: ${users.length}`)

    } catch (error) {
      console.log((error as Error).message);
    }

  }
}


