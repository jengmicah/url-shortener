const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = 'mongodb://mongo:27017/node-app';

// Exit application on error
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

// print mongoose logs in dev env
if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
    mongoose
        .connect(MONGO_URI, {
            useCreateIndex: true,
            keepAlive: 1,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        .then(() => console.log('MongoDB connected...'))
        .catch(err => console.log(err))
    return mongoose.connection;
};