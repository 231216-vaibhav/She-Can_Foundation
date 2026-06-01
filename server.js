const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const compression = require('compression');

const submissionsRoutes = require('./routes/submissions');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. Database Connection (MongoDB)
// ==========================================
const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/she_can_db';

const connectDB = async () => {
    try {
        await mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 3000 // Fast fail-retry buffer
        });
        console.log('MongoDB successfully connected!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// ==========================================
// 2. Middlewares & Security Settings
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Rate Limiters (Security Best Practice)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
});

const submissionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // Limit each IP to 10 form submissions per 10 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Spam submission protection active. Please try again after 10 minutes.'
    }
});

// Apply rate limiter to submission POST endpoint
app.use('/api/submissions', apiLimiter);
app.post('/api/submissions', submissionLimiter);

// ==========================================
// 3. Static Client Serving & HTML Routing
// ==========================================
// Enable Gzip/Brotli compression for fast text transfers (HTML, CSS, JS)
app.use(compression());

// Browser caching options for static assets to avoid repeated loading
const staticOptions = {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            // Do not cache HTML files to ensure live updates are caught
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
            // Cache images, styles, and scripts aggressively (1 year)
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
    }
};

// Serve static client assets from BOTH client/ and public/ as fallbacks to support both structures
app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use(express.static(path.join(__dirname, 'client'), staticOptions));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for Admin Dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date()
    });
});

// ==========================================
// 4. REST API Routes & Global Error Handler
// ==========================================
app.use('/api/submissions', submissionsRoutes);

// Global Central Error Handler Middleware
app.use(errorHandler);

// Start server listening
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`  She Can Foundation Backend Server Running!      `);
    console.log(`  Local Address: http://localhost:${PORT}        `);
    console.log(`  Admin Dashboard: http://localhost:${PORT}/admin `);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=================================================`);
});
