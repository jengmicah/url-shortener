import * as Yup from "yup";

const UrlSlugSchema = Yup.object().shape({
  slug: Yup.string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: Yup.string()
    .trim()
    .matches(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    )
    .required(),
});

export { UrlSlugSchema };
