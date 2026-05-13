import OpenAI from "openai";

export const gemini = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY as string,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});