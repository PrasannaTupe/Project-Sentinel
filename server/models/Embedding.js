
const mongoose = require('mongoose');

const EmbeddingSchema = new mongoose.Schema({
    text: { type: String, required: true },
    embedding: { type: [Number], required: true }, // Vector array
    meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Embedding', EmbeddingSchema);
