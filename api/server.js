import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { mongoConnect } from "./mdconfig/mdbconfig.js";
import router from "./Router/userRouter.js";
dotenv.config();

// ceating app and PORT
const app = express();
const PORT = process.env.PORT || 8000;

// connecting mogngodb
mongoConnect();

// adding middle ware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// adding gloable error handler
app.use((error, req, res, next) => {
  const errorCode = errorCode || 500;
  res.status(errorCode).json({
    status: "error",
    message: errorCode.message,
  });
});

// creating router
app.use("/aussie/", router);

app.use("*", (error, req, res) => {
  if (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

// creating listner
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`You are at http://localhost:${PORT}`);
});
