const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
    },
    category: {
        type: String,
        enum: ['Fuel', 'Maintenance', 'Insurance', 'Toll', 'Tax', 'Other'],
        required: true,
    },
    description: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
