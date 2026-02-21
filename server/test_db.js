const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('Testing connection to:', uri.replace(/:([^@]+)@/, ':****@'));

const testConnection = async () => {
    try {
        console.log('Attempting to connect...');
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ SUCCESS: Connected to MongoDB');
        process.exit(0);
    } catch (err) {
        console.error('❌ FAILURE: Could not connect');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.reason) {
            console.error('Error Reason:', JSON.stringify(err.reason, null, 2));
        }
        process.exit(1);
    }
};

testConnection();
