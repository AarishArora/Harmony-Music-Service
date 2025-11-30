import express from "express";
import musicRoutes from "./routes/music.routes.js";
import cors from "cors";
import config from "./config/config.js";

const app = express();

app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());

app.get('/health', (req, res) => {
    return res.status(200).json({ service: "Music", status: "healthy" });
});

app.use("/api/music", musicRoutes)

export default app;