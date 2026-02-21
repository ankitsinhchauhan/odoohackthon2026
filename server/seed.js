const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Organization = require('./models/Organization');
require('dotenv').config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fleetflow');
        console.log('Connected to MongoDB');

        // Clear existing data (optional)
        await User.deleteMany({ email: 'admin@fleetflow.com' });
        // await Organization.deleteMany({ name: 'FleetFlow HQ' });

        let organization = await Organization.findOne({ name: 'FleetFlow HQ' });
        if (!organization) {
            organization = new Organization({ name: 'FleetFlow HQ' });
            await organization.save();
            console.log('Organization created');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const user = new User({
            fullName: 'Admin Manager',
            email: 'admin@fleetflow.com',
            password: hashedPassword,
            organization: organization._id,
            role: 'manager',
        });

        await user.save();
        console.log('Fleet Manager account created successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seed();
