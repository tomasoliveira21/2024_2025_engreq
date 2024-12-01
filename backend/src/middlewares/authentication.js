const jwt = require('jsonwebtoken');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const authentication = (req, res, next) => {
    // Get auth from header
    const authorizationHeader = req.headers['authorization'];

    // Missing header
    if (!authorizationHeader) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    // Split "Bearer <token>"
    const parts = authorizationHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid Authorization header format' });
    }

    // Get token
    const token = parts[1];

    // Set session
    try {
        const decoded = jwt.decode(token, { complete: true });
        req.user = decoded.payload;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token',
            error: error.message,
        });
    }
};

module.exports = authentication;
