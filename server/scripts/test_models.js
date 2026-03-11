const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '../.env' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        console.log("Fetching available models...");
        const modelResponse = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).apiKey;
        // Wait, getGenerativeModel doesn't list. We need a different method if available, 
        // or just try to hit the list endpoint if the SDK exposes it.
        // The SDK doesn't have a direct 'listModels' on the top level client in v0.1?
        // Actually, looking at docs, it might not.
        // Let's try to just run a simple generateContent with a few likely candidates.

        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-latest",
            "gemini-pro",
            "gemini-1.0-pro",
            "gemini-3-flash-preview"
        ];

        for (const modelName of modelsToTry) {
            try {
                console.log(`Testing model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`✅ ${modelName} IS AVAILABLE. Response: ${result.response.text()}`);
            } catch (e) {
                console.log(`❌ ${modelName} parsing/fetching failed: ${e.message.split('[')[0]}...`); // Simplify log
            }
        }

    } catch (e) {
        console.error("Script Error:", e);
    }
}

listModels();
