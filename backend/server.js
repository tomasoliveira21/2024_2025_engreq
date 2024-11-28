require('dotenv').config();
const logger = require('./src/utils/logger');
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    logger.info(`Server is running at http://localhost:${PORT}`);
});
