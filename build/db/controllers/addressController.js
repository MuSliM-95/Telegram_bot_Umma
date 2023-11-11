import { addressInfoAdminChat } from "../../options.js";
import { updatePhoto } from "../middleWares/upload.js";
import dotenv from 'dotenv';
import Address from "../models/Address.js";
import { sendMessageTelegram } from "../../hooks/mailing/mailing.js";
dotenv.config();
export const addressController = {
    postData: async (req, res) => {
        const { name, region, place, city, prayer, address, location, time } = req.body;
        const coordinates = location.split(",");
        const photo = req.file;
        try {
            const data = await Address.create({
                title: name,
                region,
                city,
                place,
                prayer,
                photo: {
                    image: (photo === null || photo === void 0 ? void 0 : photo.filename) || "",
                },
                address,
                latitude: coordinates[0],
                longitude: coordinates[1],
                time,
            });
            sendMessageTelegram(data);
            res.json("Данные сохранены");
        }
        catch (error) {
            console.log(error.message);
        }
    },
    getAddresses: async (req, res) => {
        const location = JSON.parse(req.params.jsonLocation);
        const { topLeft, bottomRight } = location;
        try {
            const data = await Address.findAll();
            const filterAddresses = data.filter(address => {
                if ((address === null || address === void 0 ? void 0 : address.latitude) >= topLeft[0] && (address === null || address === void 0 ? void 0 : address.latitude) <= bottomRight[0]
                    && (address === null || address === void 0 ? void 0 : address.longitude) >= topLeft[1] && (address === null || address === void 0 ? void 0 : address.longitude) <= bottomRight[1]) {
                    return address;
                }
            });
            res.json(filterAddresses);
        }
        catch (error) {
            console.log(error.message);
        }
    },
    getAdminInfo: async (req, res) => {
        try {
            const data = {
                token: process.env.TOKEN,
                chatId: process.env.CHAT_ID
            };
            res.json(data);
        }
        catch (error) {
            console.log(error.message);
        }
    },
    getAddressId: async (id, bot) => {
        try {
            const data = await Address.findOne({ where: { id } });
            if (data) {
                await addressInfoAdminChat(data, bot);
            }
        }
        catch (error) {
            console.log(error.message);
        }
    },
    deleteAddress: async (addressId, obj) => {
        const { id, bot } = obj;
        try {
            const data = await Address.destroy({ where: { id: addressId } });
            if (data) {
                await bot.telegram.sendMessage(id, "Адрес удален");
            }
        }
        catch (error) {
            console.log(error.message);
        }
    },
    updateAddress: async (params) => {
        const { chatId, photo, botObj } = params;
        const addressId = chatId.split(": ")[1];
        await updatePhoto(params);
        try {
            const data = await Address.findOne({ where: { id: addressId } });
            data === null || data === void 0 ? void 0 : data.update({
                photo: {
                    image: `${photo[0].file_id}.png` || "",
                }
            });
            await (data === null || data === void 0 ? void 0 : data.save());
            if (data) {
                await addressInfoAdminChat(data, botObj);
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }
};
//# sourceMappingURL=addressController.js.map