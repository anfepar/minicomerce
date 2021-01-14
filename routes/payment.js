const express = require("express");
const PaymentService = require("../services/payment");

function paymentApi(app) {
  const router = express.Router();
  app.use("/api/payment", router);

  const paymentService = new PaymentService();
  router.post("/generatePayment", async function (req, res, next) {
    const { body } = req;
    const deepLink = paymentService.generatePayment(
      body.product,
      body.quantity
    );
    try {
      res.status(200).json({
        data: deepLink,
        message: "Deeplink generated",
      });
    } catch (err) {
      next(err);
    }
  });
}

module.exports = paymentApi;
