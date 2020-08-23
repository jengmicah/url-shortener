const express = require('express');
const { nanoid } = require('nanoid');
const { server } = require('../config/vars');
const UrlSlugSchema = require('./models/UrlSlug');
const Redirect = require('./models/Redirect');

const router = express.Router();

router.get('/', (req, res) => {
    Redirect.find()
        .then(redirects => res.render('index', { redirects }))
        .catch(err => res.status(404).json({ msg: 'No redirects found' }));
});

router.post('/shortenUrl', async (req, res, next) => {
    let { slug, url } = req.body;
    try {
        await UrlSlugSchema.validate({ slug, url });
        // Validate URL
        if (url.includes(server.uri)) {
            throw new Error(`Try not to create a loop`);
        }
        // Validate slug
        slug = slug || nanoid(5);
        // Check mongo for duplicates
        const exists = await Redirect.findOne({ slug });
        if (exists) throw new Error(`Slug in use`);
        // Add redirect to Mongo
        const newRedirect = new Redirect({ slug, url });
        newRedirect.save().then(redirect => res.json(redirect));
    } catch (error) {
        next(error);
    }
});

router.get('/:slug', async (req, res, next) => {
    const { slug } = req.params;
    try {
        // Get url mapped to the slug and redirect
        const redirect = await Redirect.findOne({ slug });
        if (redirect) return res.redirect(redirect.url);
        // if (redirect) res.json(redirect);
        else throw new Error(`Redirect doesn't exist`);
    } catch (error) {
        next(error);
    }
});

module.exports = router;