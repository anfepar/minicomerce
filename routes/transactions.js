const express = require("express");
const TransactionsService = require("../services/transactions");
const requestIp = require("request-ip");

function transactiosApi(app) {
  const router = express.Router();
  app.use("/api/transactions", router);

  const transactionsService = new TransactionsService();
  router.post("/generatePayment", async function (req, res, next) {
    const { body } = req;
    const clientIp = requestIp.getClientIp(req);
    try {
      const deepLink = await transactionsService.generatePayment(
        body.product,
        body.quantity,
        clientIp
      );
      res.status(200).json({
        data: deepLink,
        message: "Payment request generated",
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

module.exports = transactiosApi;
