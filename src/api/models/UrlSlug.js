const yup = require('yup');

const UrlSlugSchema = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});

module.exports = UrlSlugSchema;