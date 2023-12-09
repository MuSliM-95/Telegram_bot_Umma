import express from "express";
import { Telegraf } from "telegraf";
import router from "./db/routs/rout.js";
import cors from "cors";
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
import "./db/index.js";
import { start } from "./botCommands/commands.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: 'https://umma-maps.ru',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);
app.use(express.static(path.join(__dirname, '../src/db/uploads/')));
app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
export const bot = new Telegraf(process.env.TOKEN);
await start(bot);
//# sourceMappingURL=index.js.map