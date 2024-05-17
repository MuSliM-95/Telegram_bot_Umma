import multer, { Multer, FileFilterCallback } from 'multer'
import moment from 'moment'
import { Request } from 'express';
import path from 'path';
import { __dirname } from '../../index.js';

interface ExpressMulterFile extends Express.Multer.File {
  originalname: string;
}

const storage: multer.StorageEngine = multer.diskStorage({
  destination(req: Request, file: ExpressMulterFile, cb: (error: Error | null, destination: string) => void) {

    cb(null, path.join(__dirname, "../src/db/uploads/"))
  },

  filename(req: Request, file: ExpressMulterFile, cb: (error: Error | null, destination: string) => void) {
    const data = moment().format('DDMMYYYY-HHmmss_SSS')
    const name = Math.random() * (9999 - 1) + 1

    cb(null, `${data}-${name}.png`)
  }
})


const fileFilter = (req: Request, file: ExpressMulterFile, cb: FileFilterCallback) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}



export default multer({ storage, fileFilter }) as Multer 