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
