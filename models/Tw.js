const mongoose = require('mongoose');

const TwSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tw', TwSchema);