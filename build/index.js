import './config-dotenv/config-env.js';
import path from "path";
import express from "express";
import router from "./db/router/rout.js";
import cors from "cors";
import { fileURLToPath } from "url";
import "./db/db-start.js";
import { start } from "./bot/bot-commands/commands.js";
import { ErrorMiddleware } from "./db/middlewares/error-middleware.js";
import helmet from 'helmet';
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
export const adminCommand = {
    newsletter: false,
    chat: false,
    messageidArr: [],
};
const corsOptions = {
    origin: process.env.URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(router);
app.use(express.static(path.join(__dirname, '../src/db/uploads/')));
app.use(ErrorMiddleware);
app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
await start();
//# sourceMappingURL=index.js.map