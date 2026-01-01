import dotenv from 'dotenv'
import { GoogleGenerativeAI ,SchemaType} from "@google/generative-ai";
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define a strict schema for the AI to follow
const schema = {
    description: "Asset management intent extraction",
    type: SchemaType.OBJECT,
    properties: {
        intent: {
            type: SchemaType.STRING,
            description: "The user's goal",
            enum: ["find_asset", "list_all", "maintenance_report", "unknown"],
        },
        searchTerm: {
            type: SchemaType.STRING,
            description: "The name or model of the asset (e.g., 'Dell', 'Printer')",
            nullable: true,
        },
        assetId: {
            type: SchemaType.NUMBER,
            description: "The numeric ID if mentioned",
            nullable: true,
        },
    },
    required: ["intent"],
};

export const getStructuredResponse = async (userInput) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", //  the latest  stable model
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        }
    });

    const prompt = `Analyze this user request for an IT asset system: "${userInput}"`;

    try {
        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
    } catch (error) {
        console.error('AI Error:', error);
        return null;
    }
}