const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    licenseCategory: [{
        type: String,
    }],
    licenseExpiry: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['On Duty', 'Off Duty', 'Suspended', 'On Trip'],
        default: 'On Duty',
    },
    safetyScore: {
        type: Number,
        default: 100,
    },
    tripsCompleted: {
        type: Number,
        default: 0,
    },
    phone: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Driver', DriverSchema);
