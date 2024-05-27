import path from 'path';
import { readFile, writeFile } from "fs/promises"
import sharp from "sharp"
import { removeImage } from './readingFiles/readingFiles.js';
import { __dirname } from '../../index.js';
import { Context } from 'vm';
import { PrayerTimeDataItem } from '../bot-asyncs/fetch.js';

// Функция для вывода время молитв на изображения 
export const generateImage = async (ctx: Context, obj: PrayerTimeDataItem): Promise<void> => {
    const { timings, date } = obj
    const {
        Fajr,
        Sunrise,
        Dhuhr,
        Asr,
        Maghrib,
        Isha,
        Midnight,
        Lastthird,
    } = timings
    
    const { hijri, gregorian } = date

    const imagePath = path.join(__dirname, "../images/religious-muslim-man-praying-mosque.png")
    const image = await readFile(imagePath)
    const img = sharp(image)
    const textSvg = Buffer.from(`<svg width="645" height="600">
     <style>
    .title { fill: #404e58; font-size: 35px}
    </style>
     <text x="70px" y="76px" text-anchor="middle" class="title">Фаджр:</text>
     <text x="500px" y="76px" text-anchor="middle" class="title">${Fajr.split('(')[0]}</text>
     <text x="72px" y="123px" text-anchor="middle" class="title">Восход:</text>
     <text x="500px" y="123px" text-anchor="middle" class="title">${Sunrise.split('(')[0]}</text>
     <text x="51px" y="168px" text-anchor="middle" class="title">Зухр:</text>
     <text x="500px" y="168px" text-anchor="middle" class="title">${Dhuhr.split('(')[0]}</text>
     <text x="44px" y="215px" text-anchor="middle" class="title">Аср:</text>
     <text x="500px" y="215px" text-anchor="middle" class="title">${Asr.split('(')[0]}</text>
     <text x="80px" y="265px" text-anchor="middle" class="title">Магриб:</text>
     <text x="500px" y="265px" text-anchor="middle" class="title">${Maghrib.split('(')[0]}</text>
     <text x="51px" y="312px" text-anchor="middle" class="title">Иша:</text>
     <text x="500px" y="312px" text-anchor="middle" class="title">${Isha.split('(')[0]}</text>
     <text x="88px" y="405px" text-anchor="middle" class="title">Полночь:</text>
     <text x="500px" y="405px" text-anchor="middle" class="title">${Midnight.split('(')[0]}</text>
     <text x="140px" y="455px" text-anchor="middle" class="title">Посл.1/3 ночи:</text>
     <text x="500px" y="455px" text-anchor="middle" class="title">${Lastthird.split('(')[0]}</text>
     <text x="128px" y="535px" text-anchor="middle" class="title">🌘  ${hijri.date}</text>
     <text x="128px" y="585px" text-anchor="middle" class="title">⏱  ${gregorian.date}</text>
     </svg>`)

    const res = await img.composite([{ input: textSvg }]).toBuffer()
    await writeFile(path.join(__dirname, "../images/res.png"), res)

    await ctx.replyWithPhoto({ source: path.join(__dirname, "../images/res.png") }, { parse_mode: "HTML" })

    removeImage(path.join(__dirname, "../images/res.png"))

    function htmlText(): string {
        return (
            ` <u>
              <strong>Данные взяты с источника  https://aladhan.com/.</strong>
              <em>Рекомендуется оттянуть время молитвы на 15-25 мин. поскольку времена молитв местности вашего пребывания могут разниться с источником.</em>
              </u>`
        )
    }
}



