import { DataTypes } from "sequelize";
import { sequelize } from "../index.js";
const Address = sequelize.define("Address", {
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
});
Address.sync();
export default Address;
//# sourceMappingURL=Address.js.map