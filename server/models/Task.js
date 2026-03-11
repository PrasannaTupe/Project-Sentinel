
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    assignee: { type: String },
    priority: { type: String, default: 'medium' },
    status: { type: String, default: 'pending' },
    meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' }
});

module.exports = mongoose.model('Task', TaskSchema);
