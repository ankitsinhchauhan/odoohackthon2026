const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Truck', 'Van', 'Bike'],
        required: true,
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true,
    },
    maxCapacity: {
        type: Number,
        required: true,
    },
    odometer: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
        default: 'Available',
    },
    region: {
        type: String,
    },
    lastService: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
