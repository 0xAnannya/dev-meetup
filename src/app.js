const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser"); // for handling cookies
const app = express();
app.use(express.json()); // to parse JSON bodies
app.use(cookieParser()); // to parse cookies

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(7777, () => {
      console.log("listening to 7777");
    });
  })
  .catch((err) => {
    console.error("err connecting to MongoDB:", err);
  });
