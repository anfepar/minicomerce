const express = require("express");
const PaymentService = require("../services/payment");
const requestIp = require("request-ip");

function paymentApi(app) {
  const router = express.Router();
  app.use("/api/payment", router);

  const paymentService = new PaymentService();
  router.post("/generatePayment", async function (req, res, next) {
    const { body } = req;
    const clientIp = requestIp.getClientIp(req);
    try {
      const deepLink = await paymentService.generatePayment(
        body.product,
        body.quantity,
        clientIp
      );
      res.status(200).json({
        data: deepLink,
        message: "Deeplink generated",
      });
    } catch (err) {
      if (err && err.response && err.response.data) {
        const errData = err.response.data;
        res.status(500).json({
          data: errData,
        });
      }
      next(err);
    }
  });
}

module.exports = paymentApi;
