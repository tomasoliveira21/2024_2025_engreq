const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

/**
 * Get all AMAP's
 * @returns {Promise<*>}
 */
const requestAllAmaps = async () => {
    try {
        // TODO MOCK DATA
        return [
            { id: 1, name: "AMAP Porto", description: "AMAP Porto description"},
            { id: 2, name: "AMAP Braga", description: "AMAP Braga description"},
        ];

        // TODO FINISH QUERY
        // QUERY GET ALL REGISTER AMAPS
        const { data: amapData, error } = await supabase
            .from('amap')
            .select('*');

        if (error) {
            logger.error(`Error fetching user from Supabase: ${error.message}`);
            return null;
        }

        return amapData;

    } catch (err) {
        logger.error(`Unexpected error fetching user info: ${err.message}`);
        return null;
    }
};

module.exports = {
    requestAllAmaps,
};
