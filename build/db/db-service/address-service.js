import Address from "../models/Address.js";
import { addressInfoAdminChat, addressInfoUserChat } from "../../bot/options.js";
import { botCommands } from "../../bot/bot-service/сommand/getData.js";
import { bot } from "../../bot/bot-commands/commands.js";
import { removeImage } from "../../bot/bot-service/readingFiles/readingFiles.js";
import path from "path";
import { __dirname } from "../../index.js";
import { existsSync } from "fs";
export const createAddress = async (req, res, next) => {
    try {
        const { textarea, name, region, place, city, prayer, address, location, time } = req.body;
        const chatId = req.params.chatId;
        const coordinates = location === null || location === void 0 ? void 0 : location.split(',');
        const filePhoto = [];
        if (Array.isArray(req.files)) {
            req.files.forEach((file) => {
                filePhoto.push({ image: file.filename });
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
            addressInfoAdminChat(data, chatId);
        }
        addressInfoAdminChat(data, process.env.CHAT_ID);
        botCommands.add_address_counter++;
    }
    catch (error) {
        next(error);
    }
};
export const addressUpdate = async (req, res, next) => {
    try {
        const { textarea, name, region, place, pred_name, city, prayer, address, location, time } = req.body;
        const { files } = req;
        const { chatId, addressId } = req.params;
        let filePhoto = [];
        const coordinates = location === null || location === void 0 ? void 0 : location.split(',');
        const data = await Address.findOne({ where: { id: addressId } });
        if (!data) {
            throw new Error("Ошибка при попытке изменить адрес. Адрес не был найден!");
        }
        if (Array.isArray(files) && files.length > 0) {
            files.forEach((file, index) => {
                filePhoto.push({ image: file.filename });
                if (pred_name[index] !== "pngtree-img-file-document-icon-png-image_897560.jpg") {
                    removeImageInUploads(pred_name[index]);
                }
            });
        }
        else {
            filePhoto = data.photo;
        }
        if (data.photo.length > 0) {
            data.photo.forEach((file) => {
                if ((pred_name === null || pred_name === void 0 ? void 0 : pred_name.indexOf(file.image)) === -1) {
                    filePhoto.push(file);
                }
            });
        }
        if (chatId !== process.env.CHAT_ID) {
            throw new Error("У вас нет доступа, для изменения адреса");
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
        return data;
    }
    catch (error) {
        next(error);
    }
};
export const filterAddresses = (data, req) => {
    const location = JSON.parse(req.params.jsonLocation);
    const { topLeft, bottomRight } = location;
    return data.filter((address) => {
        if ((address === null || address === void 0 ? void 0 : address.latitude) >= topLeft[0] &&
            (address === null || address === void 0 ? void 0 : address.latitude) <= bottomRight[0] &&
            (address === null || address === void 0 ? void 0 : address.longitude) >= topLeft[1] &&
            (address === null || address === void 0 ? void 0 : address.longitude) <= bottomRight[1]) {
            return address;
        }
    });
};
export const addMessageInChat = (data, chatId) => {
    if (process.env.CHAT_ID !== chatId) {
        addressInfoUserChat(data, chatId);
    }
    else {
        addressInfoAdminChat(data, chatId);
    }
    botCommands.maps_counter++;
};
export const removeImageInUploads = (address) => {
    if (typeof address === 'string') {
        const pathUploads = path.join(__dirname, `../src/db/uploads/${address}`);
        const file = existsSync(pathUploads);
        if (file) {
            removeImage(pathUploads);
        }
        return;
    }
    address.photo.map(el => {
        const pathUploads = path.join(__dirname, `../src/db/uploads/${el === null || el === void 0 ? void 0 : el.image}`);
        const file = existsSync(pathUploads);
        if (file) {
            removeImage(pathUploads);
        }
    });
};
export const sendMessages = async (address, users) => {
    await bot.telegram.sendMessage(process.env.CHAT_ID, `Адреса: ${address.length}\n\nПользователей: ${users.length}\n\nДобавили адрес: ${botCommands.add_address_counter}\n
Получили адрес в чат: ${botCommands.maps_counter}\n\nВремя молитвы, по геолокации: ${botCommands.prayer_counter.geolocation}\n
Время молитвы, по названию города: ${botCommands.prayer_counter.name}\n\nОшибок: ${botCommands.errors}`);
};
//# sourceMappingURL=address-service.js.map