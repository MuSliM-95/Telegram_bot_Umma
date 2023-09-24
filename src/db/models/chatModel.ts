import {model, Schema} from "mongoose"
import { ChatTypes } from "../../types/global.js"

const chatSchema = new Schema<ChatTypes>({
    first_name: String,
    chatId: {
        type: Number,
        unique: true,
    },
    block: {
        type: Boolean,
        default: false
    },
    chat:Boolean

})

export const Chat = model("Chat", chatSchema)