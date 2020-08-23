const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const UrlSlugSchema = require('./models/UrlSlug');
const Redirect = require('./models/Redirect');

require('dotenv').config();

const app = express();
app.enable('trust proxy');
app.use(helmet());
app.use(morgan('common'));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.set('views', './src/views');

const MONGO_URI = 'mongodb://mongo:27017/node-app';
try {
  // Connect to MongoDB
  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => { throw new Error(err) });
} catch (error) {
  next(error)
}

app.get('/', (req, res) => {
  Redirect.find()
    .then(redirects => res.render('index', { redirects }))
    .catch(err => res.status(404).json({ msg: 'No redirects found' }));
});

app.post('/shortenUrl', async (req, res, next) => {
  let { slug, url } = req.body;
  try {
    await UrlSlugSchema.validate({ slug, url });
    // Validate URL
    if (url.includes(process.env.URI)) {
      throw new Error(`Try not to create a loop`);
    }
    // Validate slug
    slug = slug || nanoid(5);
    // Check mongo for duplicates
    const isDuplicate = await Redirect.findOne({ slug });
    if (isDuplicate) throw new Error('Slug in use');
    // Add redirect to Mongo
    const newRedirect = new Redirect({ slug, url });
    newRedirect.save().then(redirect => res.json(redirect));
  } catch (error) {
    next(error);
  }
});

app.get('/:slug', async (req, res, next) => {
  const { slug } = req.params;
  try {
    // TODO: Get url mapped to the slug
    // TODO: Redirect to that URL
  } catch (error) {
    // TODO: Or else, throw 404
    next(error);
  }
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});

const port = 3000;

app.listen(port, () => console.log(`Server running on ${process.env.URI}`));
