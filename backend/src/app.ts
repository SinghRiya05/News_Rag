import express from "express";
import cors from "cors";
import { errorHandler } from "./middlware/error.middleware";
import chatRoutes from "./routes/chat.route";
import ingestRoutes from "./routes/ingest.routes";
import analyzeRoutes from "./routes/analyze.routes";

const app = express();

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the News Rag API" });
});


app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/ingest", ingestRoutes);
app.use("/api/analyze", analyzeRoutes);

app.use(errorHandler);

export default app;