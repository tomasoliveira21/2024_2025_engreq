const supabase = require('../utils/supabase');
const logger = require("../utils/logger");
const {getUserData} = require("../services/userService");

const authentication = async (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const BEARER = 'Bearer';

    // Token mandatory
    if (!authorizationHeader) {
        logger.error('Authorization token missing!');
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    // Validate token
    const parts = authorizationHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== BEARER) {
        logger.error('Invalid Authorization header format!');
        return res.status(401).json({ message: 'Invalid Authorization header format' });
    }

    // Get token
    const token = parts[1];

    try {
        // Validate token with Supabase
        const { data: user, error } = await supabase.auth.getUser(token);

        if (error) {
            logger.error('Invalid or expired token!');
            return res.status(401).json({ message: 'Invalid or expired token', details: error.message });
        }

        // Request extra data Session
        const sessionExtraData = await getUserData(user.user.email);

        // Set Session
        req.user = {
            id: user.user.id,
            email: user.user.email,
            phone: user.user.phone,
            role: sessionExtraData.role,
            amapId: sessionExtraData.AMAPId,
        }

        next();
    } catch (err) {
        logger.error('Authentication error:', err.message);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports = authentication;
