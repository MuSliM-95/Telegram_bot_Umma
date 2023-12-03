import { DataTypes } from "sequelize"
import { Data } from "../../types/global.js"
import { sequelize } from "../index.js"


const Address = sequelize.define<Data>("Address", {

    region: {
         type: DataTypes.STRING,
         allowNull: false
         },
    city: {
         type: DataTypes.STRING,
         allowNull: false
         },
    title: {
         type: DataTypes.STRING,
         allowNull: false
         },  
    descriptions: {
         type: DataTypes.TEXT,
         allowNull: true
         },
    place: {
         type: DataTypes.STRING,
         allowNull: false
         },
    prayer: {
        type: DataTypes.STRING,
        allowNull: false
        },
        photo: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    address: {
        type: DataTypes.STRING,
        allowNull: false
        }, 
        latitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: false
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: false
        },
    time: {
        type: DataTypes.STRING,
        allowNull: false
        },
}, {
    timestamps: false
})

 Address.sync()

export default Address
   
















// import { Schema, model } from "mongoose"
// import { Data } from "../../types/global.js"


// const dataSchema = new Schema<Data>({
//     region: String,
//     city: String,
//     title: String,
//     place: String,
//     prayer: String,
//     photo: Object,
//     address: String, 
//     location:[],
//     time: String,
 
// }) 

// export const DataModel = model<Data>("DataModel", dataSchema)