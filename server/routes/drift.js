
const router = require('express').Router();
const Decision = require('../models/Decision');

// GET / - Fetch all decisions/drift
router.get('/', async (req, res) => {
    try {
        // Populate meeting details to show context
        const decisions = await Decision.find().populate('meetingId', 'title date');
        res.json(decisions);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST /approve - Approve/Ack functionality placeholder
router.post('/approve', async (req, res) => {
    // Implement status update logic here
    res.json({ message: "Not implemented yet" });
});

module.exports = router;
