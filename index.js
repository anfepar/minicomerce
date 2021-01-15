const express = require("express");
const app = express();
const { config } = require("./config/index");
const cors = require("cors");

const paymentApi = require("./routes/payment.js");
app.use(express.json());
app.use(cors());

paymentApi(app);

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});
