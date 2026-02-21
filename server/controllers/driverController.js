const Driver = require('../models/Driver');
const User = require('../models/User');

exports.getDrivers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const drivers = await Driver.find({ organization: user.organization });
        res.json(drivers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addDriver = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const newDriver = new Driver({
            ...req.body,
            organization: user.organization,
        });
        const driver = await newDriver.save();
        res.json(driver);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateDriver = async (req, res) => {
    try {
        let driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        const user = await User.findById(req.user.id);
        if (driver.organization.toString() !== user.organization.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        driver = await Driver.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(driver);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteDriver = async (req, res) => {
    try {
        let driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        const user = await User.findById(req.user.id);
        if (driver.organization.toString() !== user.organization.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Driver.findByIdAndDelete(req.params.id);
        res.json({ message: 'Driver removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
