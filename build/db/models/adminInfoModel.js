import { model, Schema } from "mongoose";
const adminInfoSchema = new Schema({
    token: String,
    chatId: Number,
});
export const AdminInfo = model("AdminInfo", adminInfoSchema);
//# sourceMappingURL=adminInfoModel.js.map