const Expense = require('../models/Expense');
const User = require('../models/User');

exports.getExpenses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const expenses = await Expense.find({ organization: user.organization }).populate('vehicle').populate('trip');
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addExpense = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const newExpense = new Expense({
            ...req.body,
            organization: user.organization,
        });
        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        const user = await User.findById(req.user.id);
        if (expense.organization.toString() !== user.organization.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        expense = await Expense.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        const user = await User.findById(req.user.id);
        if (expense.organization.toString() !== user.organization.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
