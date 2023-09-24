import { DataModel } from "../models/dataModel.js";
import { AdminInfo } from "../models/adminInfoModel.js";
import { addressInfoAdminChat } from "../../options.js";
import { Chat } from "../models/chatModel.js";
export const dataController = {
    postData: async (req, res) => {
        const { name, region, place, city, prayer, address, location } = req.body;
        const coordinates = location.split(",");
        const photo = req.file;
        try {
            const data = await DataModel.create({
                title: name,
                region,
                city,
                place,
                prayer,
                photo: {
                    image: (photo === null || photo === void 0 ? void 0 : photo.filename) || "",
                },
                address,
                location: coordinates
            });
            res.json(data);
        }
        catch (error) {
            console.log(error.message);
        }
    },
    getAddressesAll: async (req, res) => {
        try {
            const data = await DataModel.find();
            res.json(data);
        }
        catch (error) {
            console.log(error.message);
        }
    },
    getRegion: async () => {
        try {
            const data = await DataModel.find();
            return data;
        }
        catch (error) {
            console.log(error.message);
        }
    },
    postAdminInfo: async (req, res) => {
        const { token, chatId } = req.body;
        try {
            await AdminInfo.create({
                token,
                chatId
            });
        }
        catch (error) {
            console.log(error.message);
        }
    },
    getAdminInfo: async (req, res) => {
        try {
            const data = await AdminInfo.find();
            res.json(data);
        }
        catch (error) {
            console.log(error.message);
        }
    },
    getAddressId: async (id, bot) => {
        try {
            const data = await DataModel.findById(id);
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
            const data = await DataModel.findByIdAndDelete(addressId);
            if (data) {
                await bot.telegram.sendMessage(id, "Адрес удален");
            }
        }
        catch (error) {
            console.log(error.message);
        }
    },
    addChat: async ({ first_name, chatId, chat }) => {
        try {
            const getChat = await Chat.findOne({ chatId });
            if (!getChat) {
                const data = await Chat.create({
                    first_name,
                    chatId,
                    chat
                });
                return data;
            }
            const data = await Chat.findOneAndUpdate({ chatId }, {
                chat
            }, { new: true });
            if (data) {
                return data;
            }
        }
        catch (error) {
            console.log(error.message);
        }
    },
    getChatId: async (chatId) => {
        try {
            const data = await Chat.findOne({ chatId });
            if (data) {
                return data;
            }
        }
        catch (error) {
            console.log(error.message);
        }
    },
    getChatFirst_name: async (first_name) => {
        try {
            const data = await Chat.findOne({ first_name });
            if (data) {
                return data;
            }
        }
        catch (error) {
            console.log(error.message);
        }
    },
    updateChat: async ({ first_name, block }) => {
        try {
            const data = await Chat.findOneAndUpdate({ first_name }, {
                block
            }, { new: true });
            if (data) {
                return data === null || data === void 0 ? void 0 : data.block;
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }
};
//# sourceMappingURL=controllers.js.map