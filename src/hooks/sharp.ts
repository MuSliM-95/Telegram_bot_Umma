import path from 'path';
import { readFile, writeFile } from "fs/promises"
import { fileURLToPath } from 'url';
import sharp from "sharp"
import { unlink } from 'fs';
import { Bot, Timings } from '../types/global.js';
import { removeImage } from '../options.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для вывода время молитв на изображения 
export const generateImage = async (obj: Timings, { bot, id }: Bot) => {
    const imagePath = path.join(__dirname, "../../images/religious-muslim-man-praying-mosque.jpg")
    const image = await readFile(imagePath)
    const img = sharp(image)
    const textSvg = Buffer.from(`<svg width="600" height="400">
     <style>
    .title { fill: #404e58; font-size: 25px}
    .name_bot { font-size: 30px }
    </style>
     <text x="15px" y="25px" class="name_bot" >@DIARY_OF_A_MUSLIM_BOT</text>
     <text x="157px" y="109px" text-anchor="middle" class="title">Фаджр: ${obj.Fajr.split("(")[0]}</text>
     <text x="158px" y="147px" text-anchor="middle" class="title">Восход: ${obj.Sunrise.split("(")[0]}</text>
     <text x="145px" y="185px" text-anchor="middle" class="title">Зухр: ${obj.Dhuhr.split("(")[0]}</text>
     <text x="140px" y="225px" text-anchor="middle" class="title">Аср: ${obj.Asr.split("(")[0]}</text>
     <text x="160px" y="262px" text-anchor="middle" class="title">Магриб: ${obj.Maghrib.split("(")[0]}</text>
     <text x="145px" y="301px" text-anchor="middle" class="title">Иша: ${obj.Isha.split("(")[0]}</text>
     </svg>`)

    const res = await img.composite([{ input: textSvg }]).toBuffer()
    await writeFile(path.join(__dirname, "../../images/res.png"), res)

    await bot.telegram.sendPhoto(id, { source: path.join(__dirname, "../../images/res.png") }, {caption: htmlText(), parse_mode:"HTML" })
  
    removeImage(path.join(__dirname, "../../images/res.png"))
    //  unlink(path.join(__dirname, "../../images/res.png"), (error) => console.log(error));
}

function htmlText() {
    return `<strong>Данные взяты с источника  https://aladhan.com/.</strong>
<em>Рекомендуется оттянуть время молитвы на 15-25 мин. поскольку времена молитв местности вашего пребывания могут разниться с источником.</em>`
}

