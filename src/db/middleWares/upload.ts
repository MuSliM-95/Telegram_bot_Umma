import {  UpdateAddress } from './../../types/global.js';
import multer, { Multer, FileFilterCallback } from 'multer'
import moment from 'moment'
import { Request, Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

interface ExpressMulterFile extends Express.Multer.File {
    originalname: string;
}
  
const storage: multer.StorageEngine = multer.diskStorage({
    destination(req: Request, file: ExpressMulterFile, cb: (error: Error | null, destination: string) => void) {

        cb(null, path.join(__dirname,   "../../../src/db/uploads/"))
    }, 
    filename(req: Request, file: ExpressMulterFile, cb: (error: Error | null, destination: string) => void) {
        const data = moment().format('DDMMYYYY-HHmmss_SSS')
        cb(null, `${data}-${file.originalname}`) 
    }
})
   

const fileFilter = (req: Request, file: ExpressMulterFile, cb: FileFilterCallback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

export const updatePhoto = async ({photo, botObj}: UpdateAddress) => {
  const { bot } = botObj
try {
  const fileInfo = await  bot.telegram.getFile(photo[photo.length - 1].file_id)
  const res = await fetch(`https://api.telegram.org/file/bot${process.env.TOKEN}/${fileInfo.file_path}`, {
    headers: {
      'Content-Type': 'application/octet-stream',
    }
  }) 
 if(!res.ok) {
    return
 }

   const filename = `${photo[photo.length - 1].file_id}.png`;
   const outputPath = `../../../src/uploads/${filename}`;
   const writer = fs.createWriteStream(path.join(__dirname, outputPath));

  if(res.body) {
      res.body.pipe(writer)
  }
  
  
} catch (error) {
    console.log((error as Error).message);
}
}


export default  multer({ storage, fileFilter }) as Multer 