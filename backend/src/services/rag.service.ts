import { embeddings } from "../config/embeddings";
import { qdrantClient } from "../config/qdrant";
import { openai } from "../config/openai";
import { ChatModel } from "../model/chat.model";
import { NotFoundError } from "../core/errors";
import { isCasualMessage } from "../utils/isCasualMessage";


export async function retrieveRelevantChunks(query: string) {
    const embedQuery = await embeddings.embedQuery(query);
    const searchResult = await qdrantClient.search("news_collection", {
        vector: embedQuery,
        limit: 3,
    });

    const filteredResults = searchResult.filter(
        item => item.score > 0.4
    );

    return filteredResults;
}


export const generateAIResponse = async (query: string) => {
    // Use the utility to check if it's a casual message
    const isCasual = isCasualMessage(query);

    let relevantChunks: any[] = [];
    let context = "";

    if (!isCasual) {
        relevantChunks = await retrieveRelevantChunks(query);
        context = relevantChunks
            .map((item) => `Source: ${item.payload?.headline || 'Unknown'}\nContent: ${item.payload?.content}`)
            .join("\n\n---\n\n");
    }

    const prompt = `
        You are a helpful news assistant.
        
        If the user greets you or says something casual, respond naturally.
        If the user asks about news, answer based ONLY on the provided context.
        
        IMPORTANT: When using information from the context, mention the source name (the headline/title) naturally in your response (e.g., "According to [Source Title], ...").
        
        If the answer is not in the context, say "I could not find relevant information in the dataset."

        Context:
        ${context || "No context provided."}
        
        Question:
        ${query}
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            {
                role: "system",
                content: "You are a news assistant"
            },
            {
                role: "user",
                content: prompt
            }
        ],
    });

    const answer = response.choices[0].message.content;



    const filteredSources = (isCasual || answer?.includes("could not find relevant information"))
        ? []
        : Array.from(new Map(relevantChunks.map(chunk => [chunk.payload?.headline, chunk])).values())
            .map(chunk => ({
                title: chunk.payload?.headline,
                link: chunk.payload?.link,
                category: chunk.payload?.category,
                publishedAt: chunk.payload?.publishedAt,
                sourceName: chunk.payload?.source
            }));

    return {
        answer,
        sources: filteredSources,
    }
}

export const getChatsBySessionId = async (id: string) => {
    if (!id) throw new NotFoundError("Session ID is required");
    const chats = await ChatModel.find({ sessionId: id }).sort({ createdAt: 1 });
    return chats;
}

export const getSessions = async () => {
    const sessions = await ChatModel.aggregate([
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: "$sessionId",
                lastMessage: { $first: "$userMessage" },
                updatedAt: { $first: "$createdAt" }
            }
        },
        {
            $sort: { updatedAt: -1 }
        }
    ]);
    return sessions;
};


