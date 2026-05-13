import { Router } from "express";
import { chatWithNews, getChatsBySessionId, getSessions } from "../controllers/chat.controller";

const router = Router();

router.post("/", chatWithNews);
router.get("/sessions", getSessions);
router.get("/:id", getChatsBySessionId);

export default router;