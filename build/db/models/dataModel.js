import { Schema, model } from "mongoose";
const dataSchema = new Schema({
    region: String,
    city: String,
    title: String,
    place: String,
    prayer: String,
    photo: Object,
    address: String,
    location: [],
});
export const DataModel = model("DataModel", dataSchema);
//# sourceMappingURL=dataModel.js.map