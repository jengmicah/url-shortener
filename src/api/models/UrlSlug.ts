import * as Yup from "yup";

const UrlSlugSchema = Yup.object().shape({
  slug: Yup.string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: Yup.string().trim().url().required(),
});

export { UrlSlugSchema };
