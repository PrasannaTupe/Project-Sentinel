
const mongoose = require('mongoose');

const DecisionSchema = new mongoose.Schema({
    category: { type: String, required: true },
    currentValue: { type: String, required: true },
    proposedValue: { type: String },
    status: { type: String, default: 'active' }, // active, superseded
    meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Decision', DecisionSchema);
