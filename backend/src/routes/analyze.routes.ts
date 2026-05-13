import { Router } from "express";
import { analyzeChatController } from "../controllers/analyze.controller";

const router = Router();

router.post("/", analyzeChatController);

export default router;