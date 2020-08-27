import express from "express";
import { nanoid } from "nanoid";
import { vars } from "../config/vars";
import { IError } from "../config/express";
import { UrlSlugSchema } from "./models/UrlSlug";
import { Redirect, IRedirect } from "./models/Redirect";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

const defaultSettings = {
  buttonText: "Shorten!",
  firstLabelText: "URL",
  firstInputText: "",
  secondLabelText: vars.server.uri + "/",
  secondInputText: "",
  notificationText: "",
  success: false,
  action: "/shorten",
  method: "POST",
  disabled: false,
};

router.get("/", (req: Request, res: Response) => {
  return res.render("pages/index", defaultSettings);
});

router.post(
  "/shorten",
  async (req: Request, res: Response, next: NextFunction) => {
    let { slug } = req.body;
    const { url } = req.body;

    try {
      // Validate URL/slug
      const isValidUrl = await UrlSlugSchema.validate({ slug, url }).catch(
        (error) => {
          return res.render("pages/index", {
            ...defaultSettings,
            firstInputText: url,
            secondInputText: slug,
            notificationText: "The URL and/or alias is invalid",
          });
          // throw new Error(error);
        }
      );
      if (!isValidUrl) return;

      if (url.includes(vars.server.uri)) {
        return res.render("pages/index", {
          ...defaultSettings,
          firstInputText: url,
          secondInputText: slug,
          notificationText: "This URL redirect may create a loop.",
        });
        // throw new Error(`${url} might create a loop`);
      }
      slug = slug || nanoid(5).toLowerCase();
      // Add redirect to Mongo
      const newRedirect = new Redirect({ slug, url });
      newRedirect
        .save()
        // Return saved redirect
        .then((redirect: IRedirect) => {
          return res.render("pages/index", {
            ...defaultSettings,
            buttonText: "Shorten Another URL!",
            firstLabelText: "From",
            firstInputText: vars.server.uri + "/" + slug,
            secondLabelText: "To",
            secondInputText: url,
            notificationText: "Success! You may now use the link above.",
            success: true,
            action: "/",
            method: "GET",
            disabled: true,
          });
        })
        // Check for duplicate error (rely on database integrity to avoid race condition)
        .catch((error: any) => {
          return res.render("pages/index", {
            ...defaultSettings,
            firstInputText: url,
            secondInputText: slug,
            notificationText: "This URL redirect is a duplicate.",
          });
          // const isDuplicateError =
          //   error.name === "MongoError" && error.code === 11000;
          // if (isDuplicateError) {
          //   const duplicateError: IError = {
          //     message: `${slug} is in use`,
          //     status: 409,
          //     stack: error.stack,
          //   };
          //   next(duplicateError);
          // } else {
          //   next(error);
          // }
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
      else {
        return res.render("pages/index", {
          ...defaultSettings,
          buttonText: "Shorten a URL!",
          firstLabelText: "From",
          firstInputText: vars.server.uri + "/" + slug,
          secondLabelText: "To",
          secondInputText: "Nowhere!",
          notificationText: "Sorry! No URL redirect exists with this link.",
          action: "/",
          method: "GET",
          disabled: true,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export { router };
