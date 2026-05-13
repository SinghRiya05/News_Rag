import { gemini } from "../config/gemini";

interface IMessage {
    role: "user" | "assistant";
    content: string;
}

interface IAnalyzeChat {
    originalResponse: string;
    currentMessage: string;
    messages: IMessage[];
}

export const analyzeService = async ({
    originalResponse,
    currentMessage,
    messages,
}: IAnalyzeChat) => {

    // Last 5 analysis chat messages
    const formattedMessages = messages
        .slice(-5)
        .map(
            (msg) => `${msg.role}: ${msg.content}`
        )
        .join("\n");

    const prompt = `
You are an AI analysis assistant.

Your job is to deeply analyze the provided chatbot response.

You must:
- speak directly and naturally to the user (e.g., "I can explain..." or "This means...")
- NEVER use meta-commentary like "The user asks about..." or "The response says..."
- provide key insights briefly (max 10 lines)
- Important countries involved
- Impact on companies
- Future implications
- simplify concepts without over-explaining
- stay focused only on the provided response
- encourage follow-up questions

Do not be formal or robotic. Be a helpful, direct analysis partner. Keep it under 10 lines.

========================
ORIGINAL CHATBOT RESPONSE
========================

${originalResponse}

========================
PREVIOUS ANALYSIS CHAT
========================

${formattedMessages || "No previous conversation"}

========================
CURRENT USER MESSAGE
========================

${currentMessage}

`;

    const result = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    return result.choices[0].message.content;
};