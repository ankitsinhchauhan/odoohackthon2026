const Maintenance = require('../models/Maintenance');
const User = require('../models/User');

exports.getMaintenanceLogs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const logs = await Maintenance.find({ organization: user.organization }).populate('vehicle');
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addMaintenanceLog = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const newLog = new Maintenance({
            ...req.body,
            organization: user.organization,
        });
        const log = await newLog.save();
        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateMaintenanceLog = async (req, res) => {
    try {
        let log = await Maintenance.findById(req.params.id);
        if (!log) return res.status(404).json({ message: 'Log not found' });

        const user = await User.findById(req.user.id);
        if (log.organization.toString() !== user.organization.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        log = await Maintenance.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteMaintenanceLog = async (req, res) => {
    try {
        let log = await Maintenance.findById(req.params.id);
        if (!log) return res.status(404).json({ message: 'Log not found' });

        const user = await User.findById(req.user.id);
        if (log.organization.toString() !== user.organization.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Maintenance.findByIdAndDelete(req.params.id);
        res.json({ message: 'Log removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
