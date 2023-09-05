import fetch from "node-fetch"
import dotenv from 'dotenv'
import { generateImage } from "../hooks/sharp.js";
import { Bot, Timings } from "../types/global.js";
dotenv.config() 


interface PrayerTimeDataItem {
    timings: Timings,
    date: unknown
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
export async function prayerTime(timestamp: number, location: Location, obj: Bot,): Promise<void> {
    const { latitude, longitude } = location
    const date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate() - 1
    const { bot, id } = obj
    try {
        const res = await fetch(`http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=2`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.KEY!,
                'X-RapidAPI-Host': process.env.HOST!
            }
        })

        if (!res.ok) {
            await bot.telegram.sendMessage(id, "Проблемы с локацией")
        }

        const data: unknown = await res.json()
        const time = data as PrayerTimeData

        const timings = time.data[day]?.timings
        if (timings) {
            await generateImage(timings, obj)
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}

// Функция для получения времени молитвы по название страны и региона
export const prayerTimeCity = async (str: string[], obj: Bot): Promise<void> => {
    const [city, country] = str
    const { bot, id } = obj

    try {
        if (!city || !country) {
            await bot.telegram.sendMessage(id, "Вы ввели неправильный название страны или города")
            return
        }
        const res = await fetch(` http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=8`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.KEY!,
                'X-RapidAPI-Host': process.env.HOST!
            }
        })
        if (!res.ok) {
            await bot.telegram.sendMessage(id, "Вы ввели неправильный название страны или города")
            return
        }

        const data: PrayerTimeDataCity = await res.json() as PrayerTimeDataCity

        const timings = data.data?.timings
        if (timings) {
            await generateImage(timings, obj)
        }


    } catch (error) {
        console.log((error as Error).message);
    }
}


