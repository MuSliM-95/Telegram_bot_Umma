import fetch from "node-fetch"
import { Timings } from "../../types/global-types.js"
import { generateImage } from "../bot-service/sharp.js"
import { Context } from "vm"

interface Hijri {
    date: string
}

interface Gregorian {
    date: string
}

interface Date {
    timestamp: string,
    hijri: Hijri,
    gregorian: Gregorian
}


export interface PrayerTimeDataItem {
    timings: Timings,
    date: Date
    meta: unknown
}

interface PrayerTimeData {
    code: number,
    status: string,
    data: PrayerTimeDataItem[]
}

interface PrayerTimeDataCity {
    code: number,
    status: string,
    data: PrayerTimeDataItem
}

interface Location {
    latitude: number,
    longitude: number
}



// Функция для получения времени молитвы по геолокации
export async function prayerTime(ctx: Context, timestamp: number, location: Location): Promise<void> {
    try {
        const { latitude, longitude } = location
        const date = new Date(timestamp * 1000)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate() - 1

        const res = await fetch(`http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=2`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.KEY!,
                'X-RapidAPI-Host': process.env.HOST!
            }
        })

        if (!res.ok) {
            await ctx.reply("Проблемы с локацией")
        }

        const data = await res.json()
        const time = data as PrayerTimeData

        const timings = time.data[day]

        await generateImage(ctx, timings)

    } catch (error) {
        console.log((error as Error).message);
    }
}

// Функция для получения времени молитвы по название страны и региона
export const prayerTimeCity = async (ctx: Context, str: string[]): Promise<void> => {
    const [city, country] = str

    try {
        if (!city || !country) {
            await ctx.reply("Вы ввели неправильный название страны или города")
            return
        }
        const res = await fetch(`http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=8`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.KEY!,
                'X-RapidAPI-Host': process.env.HOST!
            }
        })
        if (!res.ok) {
            await ctx.reply("Вы ввели неправильный название страны или города")
            return
        }

        const data = await res.json() as PrayerTimeDataCity

        const timings = data.data

        await generateImage(ctx, timings)

    } catch (error) {
        console.log((error as Error).message);
    }
}


