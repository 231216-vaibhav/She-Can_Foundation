// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', err.stack || err.message || err);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Check if duplicate key error from MongoDB (e.g. if we enforce unique email, though here email doesn't have to be unique for multiple registrations, but just in case)
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate database entry.',
            error: err.message
        });
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: messages
        });
    }

    // Default error response
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
