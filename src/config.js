const constants = require('./constants');

module.exports = {
    databaseType: constants.POSTGRES,
    settings: {
        mongo: {
            connectionString: 'mongodb://localhost:27017',
        },
    },
};