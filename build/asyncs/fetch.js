import fetch from "node-fetch";
import dotenv from 'dotenv';
import { generateImage } from "../hooks/sharp.js";
dotenv.config();
export async function prayerTime(timestamp, location, obj) {
    var _a;
    const { latitude, longitude } = location;
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate() - 1;
    const { bot, id } = obj;
    try {
        const res = await fetch(`http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=2`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.KEY,
                'X-RapidAPI-Host': process.env.HOST
            }
        });
        if (!res.ok) {
            await bot.telegram.sendMessage(id, "Проблемы с локацией");
        }
        const data = await res.json();
        const time = data;
        const timings = (_a = time.data[day]) === null || _a === void 0 ? void 0 : _a.timings;
        if (timings) {
            await generateImage(timings, obj);
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
export const prayerTimeCity = async (str, obj) => {
    var _a;
    const [city, country] = str;
    const { bot, id } = obj;
    try {
        if (!city || !country) {
            await bot.telegram.sendMessage(id, "Вы ввели неправильный название страны или города");
            return;
        }
        const res = await fetch(`http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=8`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.KEY,
                'X-RapidAPI-Host': process.env.HOST
            }
        });
        if (!res.ok) {
            await bot.telegram.sendMessage(id, "Вы ввели неправильный название страны или города");
            return;
        }
        const data = await res.json();
        const timings = (_a = data.data) === null || _a === void 0 ? void 0 : _a.timings;
        if (timings) {
            await generateImage(timings, obj);
        }
    }
    catch (error) {
        console.log(error.message);
    }
};
//# sourceMappingURL=fetch.js.map