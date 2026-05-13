import express from "express";
import { ingestNewsController } from "../controllers/ingest.controller";

const router = express.Router();

router.post("/", ingestNewsController);

export default router;