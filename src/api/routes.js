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
        // Validate URL/slug
        await UrlSlugSchema.validate({ slug, url });
        if (url.includes(server.uri)) {
            throw new Error(`${url} might create a loop`);
        }
        slug = slug || nanoid(5);
        // Add redirect to Mongo
        const newRedirect = new Redirect({ slug, url });
        newRedirect.save()
            // Return saved redirect
            .then(redirect => res.json(redirect))
            // Check for duplicate error (rely on database integrity to avoid race condition)
            .catch(error => {
                const isDuplicateError = error.name === 'MongoError' && error.code === 11000;
                if (isDuplicateError) {
                    const duplicateError = new Error(`${slug} is in use`);
                    duplicateError.status = 409;
                    next(duplicateError);
                }
                else {
                    next(error);
                }
            });
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
        else throw new Error(`${slug} redirect doesn't exist`);
    } catch (error) {
        next(error);
    }
});

module.exports = router;