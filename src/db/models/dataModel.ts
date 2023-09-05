
import { Schema, model } from "mongoose"
import { Data } from "../../types/global.js"


const dataSchema = new Schema<Data>({
    region: String,
    city: String,
    title: String,
    place: String,
    prayer: String,
    photo: Object,
    address: String, 
    location:[],
 
}) 

export const DataModel = model<Data>("DataModel", dataSchema)