const path = require('path');
require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV,
    server: {
        uri: process.env.SERVER_URI
    },
    mongo: {
        uri: 'mongodb://mongo:27017/node-app'
    },
};