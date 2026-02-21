const User = require('../models/User');
const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    console.log('Registration request received:', req.body);
    try {
        const { fullName, email, password, organizationName, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Handle Organization
        let organization = await Organization.findOne({ name: organizationName });
        if (!organization) {
            organization = new Organization({ name: organizationName });
            await organization.save();
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            fullName,
            email,
            password: hashedPassword,
            organization: organization._id,
            role: role || 'dispatcher',
        });

        await user.save();

        // Create JWT
        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, organization: organization.name } });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email }).populate('organization');
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, organization: user.organization.name } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error during login', error: err.message });
    }
};
