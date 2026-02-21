require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Organization = require('./models/Organization');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');
const Trip = require('./models/Trip');
const Maintenance = require('./models/Maintenance');
const Expense = require('./models/Expense');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('Connected to MongoDB');

        // Find the seeded user/org
        const user = await User.findOne({ email: 'manager@fleet.com' });
        if (!user) {
            console.log('User not found. Run seed.js first.');
            process.exit(1);
        }

        const orgId = user.organization;

        // Clear existing data
        await Vehicle.deleteMany({ organization: orgId });
        await Driver.deleteMany({ organization: orgId });
        await Trip.deleteMany({ organization: orgId });
        await Maintenance.deleteMany({ organization: orgId });
        await Expense.deleteMany({ organization: orgId });

        console.log('Seeding Vehicles...');
        const vehicles = await Vehicle.insertMany([
            { organization: orgId, name: 'Heavy Duty Truck A1', model: 'Volvo FH16', type: 'Truck', licensePlate: 'ABC-123', maxCapacity: 25000, status: 'Available' },
            { organization: orgId, name: 'Delivery Van B2', model: 'Mercedes Sprinter', type: 'Van', licensePlate: 'VAN-456', maxCapacity: 3500, status: 'On Trip' },
            { organization: orgId, name: 'Logistics Hauler C3', model: 'Scania R500', type: 'Truck', licensePlate: 'LOG-789', maxCapacity: 30000, status: 'In Shop' },
        ]);

        console.log('Seeding Drivers...');
        const drivers = await Driver.insertMany([
            { organization: orgId, name: 'John Doe', phone: '+1234567890', licenseCategory: 'Class A', status: 'Available', safetyScore: 92, licenseExpiry: new Date('2027-12-31') },
            { organization: orgId, name: 'Jane Smith', phone: '+0987654321', licenseCategory: 'Class B', status: 'On Trip', safetyScore: 88, licenseExpiry: new Date('2026-06-15') },
        ]);

        console.log('Seeding Trips...');
        const trips = await Trip.insertMany([
            { organization: orgId, vehicle: vehicles[1]._id, driver: drivers[1]._id, origin: 'New York', destination: 'Boston', cargoWeight: 2800, status: 'On Trip' },
            { organization: orgId, vehicle: vehicles[0]._id, driver: drivers[0]._id, origin: 'Chicago', destination: 'Detroit', cargoWeight: 15000, status: 'Completed' },
        ]);

        console.log('Seeding Maintenance...');
        await Maintenance.insertMany([
            { organization: orgId, vehicle: vehicles[2]._id, type: 'Routine', description: 'Engine oil change and filter replacement', cost: 450, date: new Date(), status: 'In Progress' },
            { organization: orgId, vehicle: vehicles[0]._id, type: 'Repair', description: 'Brake pad replacement', cost: 1200, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: 'Completed' },
        ]);

        console.log('Seeding Expenses...');
        await Expense.insertMany([
            { organization: orgId, vehicle: vehicles[1]._id, trip: trips[0]._id, category: 'Fuel', amount: 150, description: 'Fuel refill NY station', date: new Date() },
            { organization: orgId, vehicle: vehicles[0]._id, trip: trips[1]._id, category: 'Toll', amount: 45, description: 'Midwest Thruway tolls', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
            { organization: orgId, vehicle: vehicles[2]._id, category: 'Maintenance', amount: 450, description: 'Routine service', date: new Date() },
        ]);

        console.log('Data Seeding Completed Successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
