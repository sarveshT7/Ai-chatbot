import { assets } from "../data/assets.js";
import { getStructuredResponse } from "../services/aiService.js";
import Fuse from 'fuse.js';

// Setup Fuzzy Search
const fuse = new Fuse(assets, {
    keys: ['name', 'owner'],
    threshold: 0.3 // 0.3 is the "sweet spot" for typos
});

export const chatController = async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'Message is required' });

    const aiData = await getStructuredResponse(message);
    if (!aiData) return res.status(500).json({ reply: 'AI service offline.' });

    const { intent, assetId, searchTerm } = aiData;

    // --- Complex Logic Starts Here ---

    // 1. Find the asset using Fuzzy Search or ID
    let asset = assetId ? assets.find(a => a.id === assetId) : null;
    if (!asset && searchTerm) {
        const results = fuse.search(searchTerm);
        if (results.length > 0) asset = results[0].item;
    }

    // 2. Handle Intents
    switch (intent) {
        case 'list_all':
            return res.json({ reply: `I'm tracking: ${assets.map(a => a.name).join(", ")}` });

        case 'find_asset':
            if (!asset) break;
            return res.json({
                reply: `Found: ${asset.name}. Status: ${asset.status}. Owner: ${asset.owner}.`
            });

        case 'update_maintenance':
            if (!asset) break;
            asset.status = "Under Maintenance"; // In a real app, update your DB here
            return res.json({ reply: `Success! I've marked the ${asset.name} as "Under Maintenance".` });

        default:
            return res.json({ reply: "I can help you find assets or put them in maintenance. Try 'Fix the Dell'." });
    }

    return res.json({ reply: `Sorry, I couldn't find an asset matching "${searchTerm || message}".` });
};