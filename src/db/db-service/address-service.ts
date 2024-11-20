import { NextFunction, Request, Response } from "express";
import { ChatTypes, Data, PhotoAttributes } from "../../types/global-types.js";
import Address from "../models/Address.js";
import { addressInfoAdminChat, addressInfoUserChat } from "../../bot/options.js";
import { botCommands } from "../../bot/bot-service/command/getData.js";
import { bot } from "../../bot/bot-commands/commands.js";
import { removeImage } from "../../bot/bot-service/readingFiles/readingFiles.js";
import path from "path";
import { __dirname } from "../../index.js";
import { existsSync } from "fs";

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { textarea, name, region, place, city, prayer, address, location, time } = req.body;
    const chatId = req.params.chatId;

    const coordinates = location?.split(',');
    const image = { image: "default.jpg" }
    const filePhoto = [image, image, image]

    if (Array.isArray(req.files)) {
      req.files.forEach((file, index) => {
        filePhoto[index] = { image: file.filename }
      });
    }

    const data = await Address.create({
      title: name,
      descriptions: textarea || '',
      region,
      city,
      place,
      prayer,
      photo: filePhoto,
      address,
      latitude: coordinates[0],
      longitude: coordinates[1],
      time,
    });

    if (chatId && process.env.CHAT_ID !== chatId) {
     await addressInfoAdminChat(data, chatId);
    }
     await  addressInfoAdminChat(data, process.env.CHAT_ID!);

    botCommands.add_address_counter++

  } catch (error) {
    next(error)
  }

}

export const addressUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { textarea, name, region, place, city, prayer, address, location, time } = req.body;

    const { files } = req
    const { chatId, addressId } = req.params
    let filePhoto: Array<PhotoAttributes> = []

    const coordinates = location?.split(',');

    const data = await Address.findOne({ where: { id: addressId } });

    if (!data) {
      throw new Error("Ошибка при попытке изменить адрес. Адрес не был найден!")
    }

    if (Array.isArray(files)) {
      files.forEach((file, index) => {

        if (file.filename === 'pred.jpg' && !data.photo[index]) {
          filePhoto[index] = { image: 'default.jpg' }
          return
        }

        if (file.filename === 'pred.jpg') {
          filePhoto[index] = data.photo[index]
          return
        }

        if (file.filename === "default.jpg") {
          filePhoto[index] = { image: file.filename }
          if (data.photo[index] && data.photo[index].image !== 'default.jpg') {
            removeImageInUploads(data.photo[index].image)
          }
          return
        }

        filePhoto[index] = { image: file.filename }
        if (data.photo[index] && data.photo[index].image !== 'default.jpg') {
          removeImageInUploads(data.photo[index].image)
        }

      })
    }

    data.update({
      title: name,
      descriptions: textarea,
      region,
      city,
      place,
      prayer,
      photo: filePhoto,
      address,
      latitude: coordinates[0],
      longitude: coordinates[1],
      time,
    });

    await data.save();

    return data
  } catch (error) {
    next(error)
  }
}

export const filterAddresses = (data: Data[], req: Request) => {
  const location = JSON.parse(req.params.jsonLocation);
  const { topLeft, bottomRight } = location;

  return data.filter((address) => {
    if (
      address?.latitude >= topLeft[0] &&
      address?.latitude <= bottomRight[0] &&
      address?.longitude >= topLeft[1] &&
      address?.longitude <= bottomRight[1]
    ) {
      return address;
    }
  });

}

export const addMessageInChat = (data: Data, chatId: string) => {
  if (process.env.CHAT_ID !== chatId) {
    addressInfoUserChat(data, chatId);
  } else {
    addressInfoAdminChat(data, chatId);
  }
  botCommands.maps_counter++
}

export const removeImageInUploads = (address: Data | string) => {
  if (typeof address === 'string') {
    const pathUploads = path.join(__dirname, `../src/db/uploads/${address}`);
    const file = existsSync(pathUploads);
    if (file && address !== 'default.jpg') {
      removeImage(pathUploads);
    }
    return
  }
  address.photo.map(el => {
    const pathUploads = path.join(__dirname, `../src/db/uploads/${el?.image}`);
    const file = existsSync(pathUploads);
    if (file && el.image !== 'default.jpg') {
      removeImage(pathUploads);
    }
  })
}


export const sendMessages = async (address: Data[], users: ChatTypes[]) => {
  await bot.telegram.sendMessage(
    process.env.CHAT_ID!,
    `Адреса: ${address.length}\n\nПользователей: ${users.length}\n\nДобавили адрес: ${botCommands.add_address_counter}\n
Получили адрес в чат: ${botCommands.maps_counter}\n\nВремя молитвы, по геолокации: ${botCommands.prayer_counter.geolocation}\n
Время молитвы, по названию города: ${botCommands.prayer_counter.name}\n\nОшибок: ${botCommands.errors}`,
  );

}