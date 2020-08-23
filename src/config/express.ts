import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { router } from "../api/routes";
import { vars } from "./vars";
import { Request, Response, NextFunction } from "express";

const app = express();

export interface IError {
  status?: number;
  message: string;
  stack: string;
}

app.enable("trust proxy");
app.use(helmet());
app.use(morgan("common"));
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.set("views", "./src/views");

app.use("/", router);

app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
    stack: vars.env === "production" ? "" : error.stack,
  });
});

// if (vars.env === "production") {
//   app.use(express.static(path.join(__dirname, "../../client/public")));
//   app.get("*", (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, "../../client/public", "index.html"));
//   });
// }

export { app };
