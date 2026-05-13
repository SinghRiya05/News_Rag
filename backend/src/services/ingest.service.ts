import fs from "fs";
import path from "path";
const { htmlToText } = require("html-to-text");
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddings } from "../config/embeddings";
import { qdrantClient } from "../config/qdrant";
import { v4 as uuidv4 } from "uuid";

export const ingestService = async () => {
    try {
        const filePath = path.join(process.cwd(), "src/data/news.json");

        const fileData = fs.readFileSync(filePath, "utf-8");

        const articles = JSON.parse(fileData);

        console.log("Total Articles:", articles.length);

        const collections = await qdrantClient.getCollections();

        const collectionExists = collections.collections.some(
            (collection) => collection.name === "news_collection"
        );

        if (!collectionExists) {

            await qdrantClient.createCollection("news_collection", {
                vectors: {
                    size: 1536,
                    distance: "Cosine",
                },
            });

            console.log("Qdrant Collection Created");

        } else {

            console.log("Collection already exists");

        }
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const BATCH_SIZE = 30;

        for (let i = 0; i < articles.length; i += BATCH_SIZE) {
            const batch = articles.slice(i, i + BATCH_SIZE);

            console.log(`\nProcessing Batch ${i / BATCH_SIZE + 1}`);
            console.log(`Articles in batch: ${batch.length}`);

            const documents: Document[] = [];

            for (const article of batch) {
                const cleanStory = htmlToText(article.story, {
                    wordwrap: false,
                });

                const content = `
                    Headline: ${article.Headline}
                    Category: ${article.category}
                    Story:
                    ${cleanStory}
`;

                const doc = new Document({
                    pageContent: content,
                    metadata: {
                        headline: article.Headline,
                        category: article.category,
                        publishedAt: article.PublishedAt,
                        source: article.source,
                        link: article.link,
                    },
                });

                documents.push(doc);
            }

            const splitDocs = await splitter.splitDocuments(documents);

            console.log("Chunks Created:", splitDocs.length);

            const points = [];

            for (const doc of splitDocs) {
                const embedding = await embeddings.embedQuery(doc.pageContent);

                points.push({
                    id: uuidv4(),
                    vector: embedding,
                    payload: {
                        content: doc.pageContent,
                        ...doc.metadata,
                    },
                });
            }

            await qdrantClient.upsert("news_collection", {
                wait: true,
                points,
            });

            console.log(`Stored ${points.length} vectors in Qdrant`);
        }
    } catch (error) {
        console.error("Error reading file:", error);
    }
}