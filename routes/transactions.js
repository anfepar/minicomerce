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

  router.get("/checkPayment/:id", async function (req, res, next) {
    const { id } = req.params;
    try {
      const paymentData = await transactionsService.checkPayment(id);
      res.status(200).json({
        data: paymentData,
        message: "Payment checked",
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

  router.get("/", async function (req, res, next) {
    try {
      const transactions = await transactionsService.getTransactions();
      res.status(200).json({
        data: transactions,
        message: "Transactions listed",
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

  router.post("/refund", async function (req, res, next) {
    const { body } = req;
    try {
      const transactionData = await transactionsService.refund(
        body.transactionId
      );
      res.status(200).json({
        data: transactionData,
        message: "Payment refunded",
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
