import multer, { Multer, FileFilterCallback } from 'multer'
import moment from 'moment'
import { Request, Express } from 'express';


interface ExpressMulterFile extends Express.Multer.File {
    originalname: string;
}
 

const storage: multer.StorageEngine = multer.diskStorage({
    destination(req: Request, file: ExpressMulterFile, cb: (error: Error | null, destination: string) => void) {

        cb(null, 'src/db/upload/')
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


export default  multer({ storage, fileFilter }) as Multer 