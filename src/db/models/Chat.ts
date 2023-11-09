import { DataTypes } from "sequelize";
import { ChatTypes } from "../../types/global.js";
import { sequelize } from "../index.js";


const Chat = sequelize.define<ChatTypes>("Chat", {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chatId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    block: {
        type: DataTypes.BOOLEAN,
    },
    chat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: false
})

Chat.sync()

export default Chat









// import {model, Schema} from "mongoose"
// import { ChatTypes } from "../../types/global.js"

// const chatSchema = new Schema<ChatTypes>({
//     first_name: String,
//     chatId: {
//         type: Number,
//         unique: true,
//     },
//     block: {
//         type: Boolean,
//         default: false
//     },
//     chat:Boolean

// })

// export const Chat = model("Chat", chatSchema)