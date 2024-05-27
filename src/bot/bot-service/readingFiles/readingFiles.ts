import { existsSync, unlink } from "fs";
import { Data } from "../../../types/global-types.js";
import path from "path";
import { __dirname } from "../../../index.js";


export const readingFs = (data: Data): string => {
    let fileName = data.photo[0] && data.photo[0].image
    for (let i = 0; i < 3; i++) {
        if (data.photo[i].image !== 'default.jpg') {
            fileName = data.photo[i].image
            break
        }
    }

    if (!fileName) {
        return 'default.jpg'
    }

    const filePath = path.join(__dirname, `../src/db/uploads/${fileName}`)
    const file = existsSync(filePath) ? fileName : 'default.jpg';

    return file

}

export const removeImage = (param: string) => {
    return unlink(param, (error) => console.log(error));
};