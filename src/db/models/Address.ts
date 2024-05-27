import { DataTypes } from "sequelize"
import { Data } from "../../types/global-types.js"
import { sequelize } from "../db-start.js"

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
        allowNull: false,
        defaultValue: []
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