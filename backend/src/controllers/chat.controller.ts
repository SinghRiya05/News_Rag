import { Request, Response } from "express";
import {
    generateAIResponse as generateResponse,
    getChatsBySessionId as fetchChats,
    getSessions as fetchSessions
} from "../services/rag.service";
import { ChatModel } from "../model/chat.model";
import { sendResponse } from "../utils/sendResponse";
import { NotFoundError } from "../core/errors";
import { catchAsync } from "../core/catchAsync";
import { STATUS_CODES } from "../config/constant";
import { dedupeSources } from "../utils/dedupeSources";

export const chatWithNews = catchAsync(async (req: Request, res: Response) => {
    const { message, sessionId } = req.body;
    if (!message) throw new NotFoundError("Message is required");
    if (!sessionId) throw new NotFoundError("Session ID is required");

    const ragResponse = await generateResponse(message);
    const uniqueSources = dedupeSources(ragResponse.sources);

    const savedChat = await ChatModel.create({
        sessionId,
        userMessage: message,
        aiResponse: ragResponse?.answer ?? "",
        sources: uniqueSources.map((item: any) => ({
            title: item?.title || "No title available",
            link: item?.link || "#",
            category: item?.category || "Unknown",
            publishedAt: item?.publishedAt
                ? new Date(Date.parse(item.publishedAt))
                : null
        })),
        status: "completed"
    });

    sendResponse(res, STATUS_CODES.CREATED, true, "Chat Response Generated", savedChat);
});

export const getChatsBySessionId = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!id) throw new NotFoundError("ID is required");
    const chats = await fetchChats(id);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Chats Fetched", chats);
});

export const getSessions = catchAsync(async (req: Request, res: Response) => {
    const sessions = await fetchSessions();
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Sessions Fetched", sessions)
})