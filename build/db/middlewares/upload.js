import multer from 'multer';
import moment from 'moment';
import path from 'path';
import { __dirname } from '../../index.js';
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, "../src/db/uploads/"));
    },
    filename(req, file, cb) {
        const data = moment().format('DDMMYYYY-HHmmss_SSS');
        const name = Math.random() * (9999 - 1) + 1;
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
export default multer({ storage, fileFilter });
//# sourceMappingURL=upload.js.map