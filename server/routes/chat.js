const router = require('express').Router();
const Meeting = require('../models/Meeting');
const Embedding = require('../models/Embedding');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /global - RAG Chat across all meetings
router.post('/global', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).send('Query required');

    try {
        console.log(`Global Chat: Embedding query '${query}'...`);
        // 1. Embed query
        // Using "embedding-001" as "text-embedding-004" was returning 404
        const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
        const embedResponse = await embeddingModel.embedContent(query);
        const queryVector = embedResponse.embedding.values;
        console.log("Global Chat: Embedding success.");

        // 2. Vector Search (Atlas)
        // If index doesn't exist, this might fail. We wrap in try-catch specific to Aggregation.
        let results = [];
        try {
            results = await Embedding.aggregate([
                {
                    $vectorSearch: {
                        index: "vector_index",
                        path: "embedding",
                        queryVector: queryVector,
                        numCandidates: 100,
                        limit: 5
                    }
                },
                {
                    $project: {
                        _id: 0,
                        text: 1,
                        meetingId: 1
                    }
                }
            ]);
        } catch (searchErr) {
            console.warn("Vector Search failed (likely missing index):", searchErr.message);
            // Fallback: If no vector search, maybe returning generic answer or just failing?
            // For now let's try to answer without context if search fails? No, prompts rely on context.
            // Let's just proceed with empty results, model will say "not in context".
        }

        const context = results.map(r => r.text).join('\n\n');

        // 3. Generate Answer
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
        You are "Sentinel", a team intelligence assistant.
        Answer the user's question based strictly on the following context steps from various meetings.
        If the answer is not in the context, say so.
        
        Context:
        ${context}

        Question: ${query}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ answer: response.text(), sources: results });

    } catch (err) {
        console.error("Chat Error:", err);
        res.status(500).json({ error: "Failed to process chat" });
    }
});

// POST /meeting/:id - Chat within specific meeting
router.post('/meeting/:id', async (req, res) => {
    const { query } = req.body;
    const { id } = req.params;

    try {
        const meeting = await Meeting.findById(id);
        if (!meeting) return res.status(404).send('Meeting not found');

        if (!meeting.transcript) {
            return res.status(400).json({ answer: "I don't have a transcript for this meeting yet. Please process the video first." });
        }

        // Using gemini-1.5-flash as the standardized stable Flash model for this SDK
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        // Flash has 1M context.
        const context = meeting.transcript.substring(0, 500000);

        const prompt = `
        You are "Sentinel", an intelligent AI assistant analyzing a meeting transcript.
        
        Meeting Title: "${meeting.title}"
        Date: ${meeting.date}
        
        Transcript:
        ${context}

        User Question: ${query}

        Instructions:
        1. Answer based STRICTLY on the transcript provided.
        2. If the answer is not in the transcript, say "I couldn't find that information in the meeting records."
        3. Be helpful, professional, and concise.
        `;

        console.log(`Meeting Chat: Generating answer for meeting ${meeting.title}...`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Meeting Chat: Success.");
        res.json({ answer: response.text() });

    } catch (err) {
        console.error("Meeting Chat Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
