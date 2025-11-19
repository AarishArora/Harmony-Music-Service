import express from "express";
import musicRoutes from "./routes/music.routes.js";
import cookieParser from "cookie-parser"
import cors from "cors";
import config from "./config/config.js";

const app = express();

app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/music", musicRoutes)

export default app;