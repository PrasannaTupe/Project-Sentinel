
const router = require('express').Router();
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const Meeting = require('../models/Meeting');
const Decision = require('../models/Decision');
const Task = require('../models/Task');
const Embedding = require('../models/Embedding');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// GenAI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Chunk text
function chunkText(text, chunkSize = 500, overlap = 50) {
    const words = text.split(' ');
    const chunks = [];
    for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
}

// POST /upload - Process Meeting
router.post('/upload', upload.single('video'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');

    const videoPath = req.file.path;
    console.log(`Processing ${videoPath}...`);

    const scriptPath = path.join(__dirname, '../scripts/process_meeting.py');
    const pythonProcess = spawn('python3', [scriptPath, videoPath], {
        env: { ...process.env }
    });

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python: ${data}`);
        errorString += data.toString();
    });

    pythonProcess.on('close', async (code) => {
        console.log(`Python process exited with code ${code}`);

        // Cleanup file
        // fs.unlinkSync(videoPath); // Keep for now or delete?

        if (code !== 0) {
            return res.status(500).json({ error: 'Processing failed', details: errorString });
        }

        try {
            const result = JSON.parse(dataString);

            // 1. Create Meeting
            const meeting = new Meeting({
                title: req.body.title || req.file.originalname,
                transcript: result.transcript,
                summary: result.summary,
                videoPath: videoPath
                // attendees: result.attendees // User requested removal
            });
            const savedMeeting = await meeting.save();

            // 2. Save Decisions & Tasks
            if (result.decisions) {
                const decisions = result.decisions.map(d => ({ ...d, meetingId: savedMeeting._id }));
                await Decision.insertMany(decisions);
            }
            if (result.tasks) {
                const tasks = result.tasks.map(t => ({ ...t, meetingId: savedMeeting._id }));
                await Task.insertMany(tasks);
            }

            // 3. Vectorization (RAG)
            const chunks = chunkText(result.transcript);

            if (chunks.length > 0) {
                try {
                    // Fallback to sequential execution parallelized with Promise.all 
                    // to avoid batchEmbedContents issues on some SDK versions
                    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

                    const embeddingPromises = chunks.map(chunk =>
                        embeddingModel.embedContent(chunk)
                            .then(res => ({
                                text: chunk,
                                embedding: res.embedding.values,
                                meetingId: savedMeeting._id
                            })).catch(e => {
                                console.error("Single Chunk Embed Error:", e.message);
                                return null;
                            })
                    );

                    const results = await Promise.all(embeddingPromises);
                    const validEmbeddings = results.filter(e => e !== null);

                    if (validEmbeddings.length > 0) {
                        await Embedding.insertMany(validEmbeddings);
                    }
                } catch (e) {
                    console.error("Vectorization Error:", e);
                }
            }

            res.json({ message: 'Meeting processed successfully', meetingId: savedMeeting._id });

        } catch (e) {
            console.error('Error parsing Python output or DB save', e);
            res.status(500).json({ error: 'Parsing/Saving failed', details: e.message });
        }
    });
});

// GET / - List all meetings
router.get('/', async (req, res) => {
    try {
        const meetings = await Meeting.find().sort({ date: -1 });
        res.json(meetings);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET /:id
router.get('/:id', async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        const decisions = await Decision.find({ meetingId: req.params.id });
        const tasks = await Task.find({ meetingId: req.params.id });
        res.json({ meeting, decisions, tasks });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
