import { Update } from 'telegraf/types';
import { Telegraf, Context } from 'telegraf';
export interface Data {
    _id: string,
    region: string,
    city: string,
    title: string,
    place: string,
    prayer: string,
    photo?: {
        image: string,
    },
    location: string[],
    address: string,
    time: string,

}
export interface File {
    filename: string,
}

export interface Bot {
    bot: Telegraf<Context<Update>>,
    id: string
}

export interface Timings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
}

export interface ChatTypes {
    first_name?: string,
    chatId?: number,
    chat?: boolean,
    block?: boolean
}
export interface Photo {
    file_id: string,
    file_unique_id: string,
    file_size: number,
    width: number,
    height: number
}

export interface  UpdateAddress {
    chatId: string,
    photo: Photo[],
    botObj: Bot
}