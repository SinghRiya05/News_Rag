import { Request, Response } from "express";
import { ingestService } from "../services/ingest.service";
import { sendResponse } from "../utils/sendResponse";
import { catchAsync } from "../core/catchAsync";
import { STATUS_CODES } from "../config/constant";

export const ingestNewsController = catchAsync(async (req: Request, res: Response) => {
    await ingestService();
    sendResponse(res, STATUS_CODES.SUCCESS, true, "News ingested successfully", null);
});