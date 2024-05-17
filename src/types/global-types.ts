import { Update } from 'telegraf/types';
import { Telegraf, Context } from 'telegraf';
import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { MessageData } from '../bot/bot-service/mailing/mailing.js';

export interface PhotoAttributes {
  image: string;
}


export interface Data extends Model<InferAttributes<Data>, InferCreationAttributes<Data>> {
  id?: string;
  region: string;
  city: string;
  title: string;
  descriptions: string;
  place: string;
  prayer: string;
  photo: Array<PhotoAttributes>;
  latitude: string;
  longitude: string;
  address: string;
  time: string;
}
export interface File {
  filename: string;
}

export interface Bot {
  bot: Telegraf<Context<Update>>;
  id: string;
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
  Lastthird: string
}

export interface ChatTypes extends Model<InferAttributes<ChatTypes>, InferCreationAttributes<ChatTypes>> {
  id?: number;
  first_name: string;
  chatId: string;
  chat: boolean;
  block: boolean;
}
export interface Photo {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
}

export interface UpdateAddress {
  text: string;
  photo: Photo[];
  id: string;
}

export interface Admin extends MessageData {
  newsletter: boolean,
  chat: boolean
}