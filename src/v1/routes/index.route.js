const express = require("express");
const webhookRoute = require("./webhook.route");
const app = express();

// End Points of Api
app.use("/webhook/", webhookRoute);

module.exports = app;
