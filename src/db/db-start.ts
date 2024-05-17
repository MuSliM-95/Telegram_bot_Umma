import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DB_NAME!, process.env.USER_DB!, process.env.PASSWORD_DB!, {
    host: process.env.HOST_DB!,
    dialect: "mysql",
    logging: false,
    port: Number(process.env.DB_PORT!),

});

export const connect = async (): Promise<void> => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}


await connect() 