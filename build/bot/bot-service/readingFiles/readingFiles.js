import { existsSync, unlink } from "fs";
import path from "path";
import { __dirname } from "../../../index.js";
export const readingFs = (data) => {
    const fileName = data.photo[0] && data.photo[0].image;
    if (!fileName) {
        return 'default.jpg';
    }
    const filePath = path.join(__dirname, `../src/db/uploads/${fileName}`);
    const file = existsSync(filePath) ? fileName : 'default.jpg';
    return file;
};
export const removeImage = (param) => {
    return unlink(param, (error) => console.log(error));
};
//# sourceMappingURL=readingFiles.js.map