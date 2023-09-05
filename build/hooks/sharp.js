import path from 'path';
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from 'url';
import sharp from "sharp";
import { unlink } from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const generateImage = async (obj, { bot, id }) => {
    const imagePath = path.join(__dirname, "../../image/prayerTime.png");
    const image = await readFile(imagePath);
    const img = sharp(image);
    const textSvg = Buffer.from(`<svg width="400" height="267">
     <style>
    .title { fill: #404e58; font-size: 17px}
     </style>
     <text x="170px" y="39px" text-anchor="middle" class="title">${obj.Fajr.split("(")[0]}</text>
     <text x="170px" y="77px" text-anchor="middle" class="title">${obj.Sunrise.split("(")[0]}</text>
     <text x="170px" y="115px" text-anchor="middle" class="title">${obj.Dhuhr.split("(")[0]}</text>
     <text x="170px" y="155px" text-anchor="middle" class="title">${obj.Asr.split("(")[0]}</text>
     <text x="170px" y="192px" text-anchor="middle" class="title">${obj.Maghrib.split("(")[0]}</text>
     <text x="170px" y="231px" text-anchor="middle" class="title">${obj.Isha.split("(")[0]}</text>
     </svg>`);
    const res = await img.composite([{ input: textSvg }]).toBuffer();
    await writeFile(path.join(__dirname, "../../image/res.png"), res);
    await bot.telegram.sendPhoto(id, { source: path.join(__dirname, "../../image/res.png") });
    unlink(path.join(__dirname, "../../image/res.png"), (error) => console.log(error));
};
//# sourceMappingURL=sharp.js.map