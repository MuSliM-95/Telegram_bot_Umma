import { Sequelize } from "sequelize";
import dotenv from "dotenv"


dotenv.config()


export const sequelize = new Sequelize(process.env.DB_NAME!, process.env.USER!, process.env.PASSWORD!, {
    host: process.env.HOST_DB!,
    dialect: "mysql",
    logging: false,
    port: Number(process.env.DB_PORT!),
    
});

export const connect  = async () => {
    try {
        await sequelize.authenticate() 
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.log('Unable to connect to the database:', error );
    }
  }


  connect()