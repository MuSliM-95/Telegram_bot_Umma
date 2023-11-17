import { Request } from "express";
import { Response } from 'express';
import { addressInfoAdminChat } from "../../options.js";
import { Bot, UpdateAddress } from "../../types/global.js";
import { updatePhoto } from "../middleWares/upload.js";
import dotenv from 'dotenv'
import Address from "../models/Address.js";
import { sendMessageTelegram } from "../../hooks/mailing/mailing.js";

dotenv.config()

export const addressController = {
  postData: async (req: Request, res: Response): Promise<void> => {

    const { name, region, place, city, prayer, address, location, time } = req.body
    const coordinates = location.split(",")
    const photo = req.file
    try {
      const data = await Address.create({
        title: name,
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
        
       sendMessageTelegram(data)
      res.json("Данные сохранены")
    } catch (error) {
      console.log((error as Error).message);

    }
  },

  getAddresses: async (req: Request, res: Response) => {
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


  getAddressId: async (id: string, bot: Bot) => {
    try {
      const data = await Address.findOne({ where: { id } })

      if (data) {
        await addressInfoAdminChat(data, bot)
      }

    } catch (error) {
      console.log((error as Error).message);
    }
  },

  deleteAddress: async (addressId: string, obj: Bot) => {
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

  updateAddress: async (params: UpdateAddress) => {
    const { chatId, photo, botObj } = params
    const addressId = chatId.split(": ")[1]
    await updatePhoto(params)

    try {
      const data = await Address.findOne({ where: { id: addressId } })
      data?.update(
        {
          photo: {
            image: `${photo[photo.length -1].file_id}.png` || "",
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
  }
}