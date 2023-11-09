import { DataTypes } from "sequelize";
import { sequelize } from "../index.js";
const Chat = sequelize.define("Chat", {
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
});
Chat.sync();
export default Chat;
//# sourceMappingURL=Chat.js.map