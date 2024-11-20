import { DataTypes } from "sequelize";
import { sequelize } from "../db-start.js";
const Chat = sequelize.define("Chat", {
    first_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "DEFAULT"
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
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});
Chat.sync();
export default Chat;
//# sourceMappingURL=Chat.js.map