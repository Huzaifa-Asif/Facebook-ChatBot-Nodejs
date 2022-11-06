const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require("dotenv").config();
const logger = require("morgan");
const cors = require("cors");

const app = express();
app.disable("x-powered-by");
app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, 'public')));

const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));

const connectDB = require("#config/connectdb");
const indexRouter = require("#routes/index.route");
const rateLimiter = require("#middlewares/rateLimiter.middleware");
require("#utils/randomNumber.utils");
connectDB()
app.use(rateLimiter.limiter);
app.use("/api/v1/", indexRouter);

app.all("*", function (req, res) {
  return res.status(401).json({success: false, message: "Route not found"});
});

app.use((err, req, res) => {
  if (err.name == "UnauthorizedError") {
    return res.status(401).json({success: false, message: "The request is failed due to unauthorization"});
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});