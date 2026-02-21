const Trip = require('../models/Trip');
const User = require('../models/User');

exports.getTrips = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const trips = await Trip.find({ organization: user.organization }).populate('vehicle').populate('driver');
        res.json(trips);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addTrip = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const newTrip = new Trip({
            ...req.body,
            organization: user.organization,
        });
        const trip = await newTrip.save();
        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateTrip = async (req, res) => {
    try {
        let trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        const user = await User.findById(req.user.id);
        if (trip.organization.toString() !== user.organization.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        trip = await Trip.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        let trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        const user = await User.findById(req.user.id);
        if (trip.organization.toString() !== user.organization.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Trip.findByIdAndDelete(req.params.id);
        res.json({ message: 'Trip removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
