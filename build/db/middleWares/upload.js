import multer from 'multer';
import moment from 'moment';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination(req, file, cb) {
        console.log(path.join(__dirname, "../../../src/db/uploads/"));
        cb(null, path.join(__dirname, "../../../src/db/uploads/"));
    },
    filename(req, file, cb) {
        const data = moment().format('DDMMYYYY-HHmmss_SSS');
        const name = file.originalname.slice(0, 6);
        cb(null, `${data}-${name}.png`);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
export const updatePhoto = async ({ photo, botObj }) => {
    const { bot } = botObj;
    try {
        const fileInfo = await bot.telegram.getFile(photo[photo.length - 1].file_id);
        const res = await fetch(`https://api.telegram.org/file/bot${process.env.TOKEN}/${fileInfo.file_path}`, {
            headers: {
                'Content-Type': 'application/octet-stream',
            }
        });
        if (!res.ok) {
            return;
        }
        const filename = `${photo[photo.length - 1].file_id}.png`;
        const outputPath = `../../../src/db/uploads/${filename}`;
        const writer = fs.createWriteStream(path.join(__dirname, outputPath));
        if (res.body) {
            res.body.pipe(writer);
        }
    }
    catch (error) {
        console.log(error.message);
    }
};
export default multer({ storage, fileFilter });
//# sourceMappingURL=upload.js.map