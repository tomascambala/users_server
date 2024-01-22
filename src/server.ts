import express from "express";
import dotenv from "dotenv";
import path from "path";
import User from "./models/user";
import userRouter from "./routes/user";

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const cors = require('cors');
void User.sync();

if (process.env.NODE_ENV == "development") {
  dotenv.config({ path: path.resolve(__dirname, "../.env.development") });
}

if (process.env.NODE_ENV == "test") {
  dotenv.config({ path: path.resolve(__dirname, "../.env.test") });
}

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use("/user", userRouter);

const start = async (): Promise<void> => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port: ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();

export default app;
