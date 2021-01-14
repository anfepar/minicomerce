const express = require("express");
const app = express();
const { config } = require("./config/index");

const paymentApi = require("./routes/payment.js");

paymentApi(app);

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});
