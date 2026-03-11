
const router = require('express').Router();
const Task = require('../models/Task');

// GET / - Fetch all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('meetingId', 'title date');
        res.json(tasks);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST / - Create or Update task
router.post('/', async (req, res) => {
    const task = new Task(req.body);
    try {
        const savedTask = await task.save();
        res.json(savedTask);
    } catch (err) {
        res.status(400).json(err);
    }
});

// DELETE /:id - Delete task
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
