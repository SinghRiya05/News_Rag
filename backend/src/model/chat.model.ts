import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
    {
        sessionId: {
            type: String,
            required: true,
            index: true,
        },

        userMessage: {
            type: String,
            required: true,
        },

        aiResponse: {
            type: String,
            default: "",
        },

        sources: {
            type: [{
                title: String,
                link: String,
                category: String,
                publishedAt: Date,
            }],
            default: [],
        },

        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

export const ChatModel = mongoose.model("Chat", chatSchema);