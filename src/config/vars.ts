import * as dotenv from "dotenv";
dotenv.config();

interface IVariables {
  env: string;
  server: { uri: string };
  mongo: { uri: string };
}

const vars: IVariables = {
  env: process.env.NODE_ENV,
  server: {
    uri: process.env.SERVER_URI,
  },
  mongo: {
    uri: "mongodb://mongo:27017/node-app",
  },
};

export { vars };
