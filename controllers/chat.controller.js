import { assets } from "../data/assets.js";
import { getStructuredResponse } from "../services/aiService.js";

export const chatController = async (req, res, next) => {
    const { message } = req.body;
    if (!message)
        return res.status(400).json({ reply: 'Message is required' })

    const response = await getStructuredResponse(message)
    console.log('response from the ai',response)
    if (!response) return res.status(500).json({ reply: 'AI service is currently unavailable.' })

    try {
       const parsedRes = JSON.parse(response);
        console.log('Parsed Response:', parsedRes);

        if (parsedRes.intent === 'asset_query' && parsedRes.assetId) {
            const asset = assets.find(a => a.id === parsedRes.assetId);
            if (!asset) return res.status(400).json({ reply: `No asset found with ID ${parsedRes.assetId}` });
            return res.status(200).json({
                reply: `Asset Details:\nName: ${asset.name}\n Status: ${asset.status}\n Owner: ${asset.owner}`
            });
        }
        return res.json({ reply: "I can help with asset-related queries only." });

    } catch (error) {
        return res.json({ reply: "Unable to understand your request." });
    }
}