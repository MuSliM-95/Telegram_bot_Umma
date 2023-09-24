import { model, Schema } from "mongoose";
const chatSchema = new Schema({
    first_name: String,
    chatId: {
        type: Number,
        unique: true,
    },
    block: {
        type: Boolean,
        default: false
    },
    chat: Boolean
});
export const Chat = model("Chat", chatSchema);
//# sourceMappingURL=chatModel.js.map