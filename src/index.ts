import express, { Application } from "express"
import { connect } from "mongoose";
import { Telegraf } from "telegraf"
import { Context } from "vm";
import {
    keyboardСontainer,
    prayerKeyboardСontainer
} from "./options.js";
import { prayerTime, prayerTimeCity } from "./asyncs/fetch.js";
import rgx from "./hooks/regExp/regExp.js";
import router from "./db/routs/rout.js"
import cors from "cors"
import dotenv from 'dotenv'
import { dataController } from "./db/controllers/controllers.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config()

const app: Application = express(); 
const PORT = process.env.PORT || 5000 
 
const corsOptions = {
    origin: 'https://umma-e96w.onrender.com', 
}; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  
app.use(express.json());
app.use(cors(corsOptions));
app.use(router) 

app.use(express.static(path.join(__dirname, './db/upload/')))

await connect(process.env.MONGODB!)
 
app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
 

const bot = new Telegraf(process.env.TOKEN!)

const start = async () => {

        let newText: string[] | boolean = false

// Обработка команд
        bot.start((ctx) => ctx.reply("Выберите действие", keyboardСontainer))
        bot.hears("Время молитв", (ctx) => ctx.reply("Выберите действие", prayerKeyboardСontainer))
        bot.hears("На главную", (ctx) => ctx.reply("Выберите действие", keyboardСontainer))
        bot.hears("По названию города", (ctx) => {
            ctx.reply("Введите названия города в таком формате: Египет, Каир")
            newText = true
        } )
        bot.on("message", async (ctx: Context) => {
    
            const { text } = ctx?.message;
            const { id } = ctx?.chat;
            const timestamp = ctx?.update?.message.date
            const { location } = ctx?.update?.message
        
            if(text){
             var [idAddress, params ] = text?.split(": ")
            }
    

            if (!location && newText) {
                newText = rgx(text) 
                await prayerTimeCity(newText as string[], { bot, id })
                newText = false
                return
            }
     
            if (idAddress === "id" && params) {
                dataController.getAddressId(params, { bot, id })
                return 
            }
    
       
            if (location) {
                await prayerTime(timestamp, location, { bot, id })
                return
            }  
        })

        bot.on("callback_query", async (query:Context) => {
            if(!query) {
              return 
            }
            const callbackData = query.update.callback_query.data;
            const id = query.from.id

           const idToDelete = callbackData?.split(' ')
           
            if(idToDelete[0] === 'Удалить') {
               dataController.deleteAddress(idToDelete[1], {bot, id})   
            }
        }) 
    
        bot.launch();
    
        // Enable graceful stop
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
           
}


start()


