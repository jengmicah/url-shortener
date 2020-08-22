const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const app = express();
app.enable('trust proxy');
app.use(helmet());
app.use(morgan('common'));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/node-app',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const port = 3000;

app.listen(port, () => console.log('Server running...'));
