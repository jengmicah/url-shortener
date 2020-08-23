const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('../api/routes');

const app = express();
app.enable('trust proxy');
app.use(helmet());
app.use(morgan('common'));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.set('views', './src/views');

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '' : error.stack,
    });
});

app.use('/', routes);

module.exports = app;