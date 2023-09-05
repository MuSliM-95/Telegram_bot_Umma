import multer from 'multer';
import moment from 'moment';
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'src/db/upload/');
    },
    filename(req, file, cb) {
        const data = moment().format('DDMMYYYY-HHmmss_SSS');
        cb(null, `${data}-${file.originalname}`);
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