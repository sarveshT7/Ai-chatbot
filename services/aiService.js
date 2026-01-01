import dotenv from 'dotenv'
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config()

// Initialize the SDK with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getStructuredResponse = async (userInput) => {
    console.log("GEMINI SERVICE CALLED WITH:", userInput);

    // Use gemini-2.5-flash for speed and efficiency in JSON tasks
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // Use the current stable Flash model
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
        You are an assistant that converts user queries into JSON. 
        Return ONLY valid JSON.

        Convert this query into JSON: "${userInput}"

        JSON format:
        {
            "intent": "asset_query | workflow_help | unknown",
            "assetId": number | null
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log("AI RESPONSE:", text);
        return text; // This will be a stringified JSON
    } catch (error) {
        console.error('Error fetching Gemini response:', error.message);
        return null;
    }
}