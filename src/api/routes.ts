import express from "express";
import { nanoid } from "nanoid";
import { vars } from "../config/vars";
import { IError } from "../config/express";
import { UrlSlugSchema } from "./models/UrlSlug";
import { Redirect, IRedirect } from "./models/Redirect";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

// router.get("/", (req: Request, res: Response) => {
//   Redirect.find()
//     .then((redirects: IRedirect[]) => res.render("index", { redirects }))
//     .catch(() => res.status(404).json({ msg: "No redirects found" }));
// });

router.get("/", (req: Request, res: Response) => {
  Redirect.find().then((redirects: IRedirect[]) =>
    res.render("pages/index", { redirects, serverUri: vars.server.uri })
  );
  //   res.render("pages/index");
});

router.post(
  "/shortenUrl",
  async (req: Request, res: Response, next: NextFunction) => {
    let { slug } = req.body;
    const { url } = req.body;

    try {
      // Validate URL/slug
      await UrlSlugSchema.validate({ slug, url });
      if (url.includes(vars.server.uri)) {
        throw new Error(`${url} might create a loop`);
      }
      slug = slug || nanoid(5);
      // Add redirect to Mongo
      const newRedirect = new Redirect({ slug, url });
      newRedirect
        .save()
        // Return saved redirect
        .then((redirect: IRedirect) => res.json(redirect))
        // Check for duplicate error (rely on database integrity to avoid race condition)
        .catch((error: any) => {
          const isDuplicateError =
            error.name === "MongoError" && error.code === 11000;
          if (isDuplicateError) {
            const duplicateError: IError = {
              message: `${slug} is in use`,
              status: 409,
              stack: error.stack,
            };
            next(duplicateError);
          } else {
            next(error);
          }
        });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:slug",
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    try {
      // Get url mapped to the slug and redirect
      const redirect = await Redirect.findOne({ slug });
      if (redirect) return res.redirect(redirect.url);
      else return res.status(404).json({ msg: "No redirects found" });
    } catch (error) {
      next(error);
    }
  }
);

export { router };
