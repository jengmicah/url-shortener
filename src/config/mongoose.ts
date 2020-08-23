import mongoose from "mongoose";
import { vars } from "./vars";

const MONGO_URI: string = "mongodb://mongo:27017/node-app";

// Exit application on error
mongoose.connection.on("error", (err: any) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// Print mongoose logs in dev env
if (vars.env === "development") {
  mongoose.set("debug", true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
export const connectToMongo = () => {
  mongoose
    .connect(MONGO_URI, {
      useCreateIndex: true,
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => console.log("MongoDB connected..."))
    .catch((err: any) => console.log(err));
  return mongoose.connection;
};
