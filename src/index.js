const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

require('dotenv').config();

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

// app.get('/', (req, res) => {
//   res.json({ "response": "root" })
// });

const urlSchema = yup.object().shape({
  slug: yup.string().trim().matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
});

app.post('/shortenUrl', async (req, res, next) => {
  let { slug, url } = req.body;
  try {
    await urlSchema.validate({ slug, url });
    // Validate URL
    if (url.includes(process.env.URI)) {
      throw new Error(`Try not to create a loop`);
    }
    // Validate slug
    slug = slug || nanoid(5);
    // TODO: check mongo for duplicates
    const newRedirect = { slug, url };
    // TODO: add slug and redirect to mongo
    res.json(newRedirect);
  } catch (error) {
    console.log(error);
  }
});

app.get('/:slug', async (req, res, next) => {
  const { slug } = req.params;
  try {
    // TODO: Get url mapped to the slug
    // TODO: Redirect to that URL
  } catch (error) {
    // TODO: Or else, throw 404
    console.log(error);
  }
});

const port = 3000;

app.listen(port, () => console.log(`Server running on ${process.env.URI}`));
