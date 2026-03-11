
const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    transcript: { type: String },
    summary: { type: String },
    attendees: [{ type: String }],
    videoPath: { type: String }
});

module.exports = mongoose.model('Meeting', MeetingSchema);
