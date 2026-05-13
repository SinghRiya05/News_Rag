import { Request, Response } from "express";
import { analyzeService } from "../services/analyze.service";
import { sendResponse } from "../utils/sendResponse";
import { catchAsync } from "../core/catchAsync";
import { STATUS_CODES } from "../config/constant";
import { NotFoundError } from "../core/errors";

export const analyzeChatController = catchAsync(async (req: Request, res: Response) => {
    const {
        originalResponse,
        currentMessage,
        messages
    } = req.body;

    if (!originalResponse) {
        throw new NotFoundError("Provide original response.");
    }
    const response = await analyzeService({
        originalResponse,
        currentMessage: currentMessage || "Analyze this response in detail",
        messages: messages || []
    });
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Analysis complete", response);
});