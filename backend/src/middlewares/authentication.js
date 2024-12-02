const supabase = require('../utils/supabase');

const authentication = async (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const BEARER = 'Bearer';

    // Token mandatory
    if (!authorizationHeader) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    // Validate token
    const parts = authorizationHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== BEARER) {
        return res.status(401).json({ message: 'Invalid Authorization header format' });
    }

    // Get token
    const token = parts[1];

    try {
        // Validate token with Supabase
        const { data: user, error } = await supabase.auth.getUser(token);

        if (error) {
            return res.status(401).json({ message: 'Invalid or expired token', details: error.message });
        }

        // Set Session
        req.user = user;

        next();
    } catch (err) {
        console.error('Supabase authentication error:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports = authentication;
