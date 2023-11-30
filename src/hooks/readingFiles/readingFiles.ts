import { existsSync } from "fs";


export const readingFs =  (filePath: string): boolean => {

 return existsSync(filePath);
}