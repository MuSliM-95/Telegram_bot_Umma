import {model, Schema} from "mongoose"
import { Admin } from "../../types/global.js"


const adminInfoSchema = new Schema<Admin>({
    token: String,
    chatId: Number,
})

export const AdminInfo = model("AdminInfo", adminInfoSchema )