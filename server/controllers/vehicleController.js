const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

exports.getVehicles = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const vehicles = await Vehicle.find({ organization: user.organization });
        res.json(vehicles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addVehicle = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const newVehicle = new Vehicle({
            ...req.body,
            organization: user.organization,
        });
        const vehicle = await newVehicle.save();
        res.json(vehicle);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        let vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        const user = await User.findById(req.user.id);
        if (vehicle.organization.toString() !== user.organization.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(vehicle);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        let vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        const user = await User.findById(req.user.id);
        if (vehicle.organization.toString() !== user.organization.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vehicle removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
