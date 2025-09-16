const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const urlRoutes = require('./routes/url');

// Load environment variables ASAP
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Health endpoint
app.get('/health', (req, res) => {
    const state = mongoose.connection.readyState;
    res.json({status : 'ok', dbState : state});
});

// MongoDB Atlas connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('Missing MONGO_URI in environment. Please create a .env with MONGO_URI=<your connection string>.');
    process.exit(1);
}

// Helpful connection logs
mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection disconnected');
});

// Enable mongoose debug only in development
if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
}

// Models
const Url = require('./models/Url');

// Routes
app.use('/api', urlRoutes);

// TEMP: Debug write endpoint (remove in production)
app.post('/debug/test-write', async (req, res) => {
    try {
        const doc = await Url.create({
            shortCode : `test${Math.random().toString(36).slice(2, 8)}`,
            originalUrl : 'https://example.com',
        });
        res.json({ok : true, id : doc._id});
    } catch (err) {
        console.error('Test write failed:', err);
        res.status(500).json({ok : false, error : err.message});
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({error : 'Internal Server Error', details : err?.message});
});

// Process-level handlers
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

function maskMongoUri(uri) {
    try {
        const u = new URL(uri);
        if (u.password) {
            u.password = '***';
        }
        return u.toString();
    } catch {
        return '<invalid mongo uri>';
    }
}

async function start() {
    try {
        const dbName = process.env.MONGO_DB || 'shrinkly';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri, {dbName});
        console.log('MongoDB connected');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB. Server not started.', err);
        process.exit(1);
    }
}

start();