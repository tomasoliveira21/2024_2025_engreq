const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;

    // Handle 404 Errors
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

    // General Error Handling
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
