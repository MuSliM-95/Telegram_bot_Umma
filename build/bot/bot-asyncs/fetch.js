import fetch from "node-fetch";
import { generateImage } from "../bot-service/sharp.js";
export async function prayerTime(ctx, timestamp, location) {
    try {
        const { latitude, longitude } = location;
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate() - 1;
        const res = await fetch(`http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=2`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.KEY,
                'X-RapidAPI-Host': process.env.HOST
            }
        });
        if (!res.ok) {
            await ctx.reply("Проблемы с локацией");
        }
        const data = await res.json();
        const time = data;
        const timings = time.data[day];
        await generateImage(ctx, timings);
    }
    catch (error) {
        console.log(error.message);
    }
}
export const prayerTimeCity = async (ctx, str) => {
    const [city, country] = str;
    try {
        if (!city || !country) {
            await ctx.reply("Вы ввели неправильный название страны или города");
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
            await ctx.reply("Вы ввели неправильный название страны или города");
            return;
        }
        const data = await res.json();
        const timings = data.data;
        await generateImage(ctx, timings);
    }
    catch (error) {
        console.log(error.message);
    }
};
//# sourceMappingURL=fetch.js.map