/**
 *
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;

    // 400
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            details: err.errors,
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized - Invalid token',
        });
    }

    if (err.name === 'ForbiddenError') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden - Access Denied',
        });
    }

    if (statusCode === 404) {
        return res.status(404).send(`
            <html>
                <head>
                    <title>404 - Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { color: #ff0000; }
                    </style>
                </head>
                <body>
                    <h1>404 - Page Not Found</h1>
                    <p>The page <code>${req.url}</code> does not exist.</p>
                    <a href="/">Go back to Home</a>
                </body>
            </html>
        `);
    }

    if (err.code && err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate Key Error',
            details: err.keyValue,
        });
    }

    // Global
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

module.exports = errorHandler;
