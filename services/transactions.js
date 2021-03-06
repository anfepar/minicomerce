const axios = require("axios");
const { config } = require("../config/index");
const products = require("../models/products.json");
const MongoLib = require("../lib/mongo");
const STRINGS = require("../constants/strings");

class TransactionsService {
  constructor() {
    this.collection = "transactions";
    this.mongoDB = new MongoLib();
  }
  async generatePayment(productId, quantity, clientIp) {
    const transaction = {
      product: productId,
      quantity,
      status: STRINGS.TRANSACTION_STATUS_CREATED,
      user_ip: clientIp,
    };
    return this.mongoDB
      .create(this.collection, transaction)
      .then((transactionId) => {
        const product = products.find((product) => product.id === productId);
        const totalPrice = product.price * quantity;
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        return axios
          .post(
            `${config.tpagaApi}/payment_requests/create`,
            {
              cost: totalPrice,
              idempotency_token: transactionId,
              order_id: transactionId,
              terminal_id: "web_page",
              user_ip_address: clientIp,
              purchase_details_url: `${config.frontendUrl}/payment/${transactionId}`,
              purchase_description: product.name,
              expires_at: expirationDate,
            },
            {
              auth: {
                username: config.tpagaUser,
                password: config.tpagaPasswd,
              },
            }
          )
          .then((res) => {
            if (res && res.data) {
              const tpagaData = res.data;
              this.mongoDB.update(this.collection, transactionId, {
                tpaga_token: tpagaData.token,
              });
              return tpagaData;
            }
          })
          .catch((error) => {
            this.mongoDB.update(this.collection, transactionId, {
              status: STRINGS.TRANSACTION_STATUS_FAILED,
            });
            throw new Error(error);
          });
      });
  }
  async checkPayment(transactionId) {
    return this.mongoDB
      .get(this.collection, transactionId)
      .then((transaction) => {
        if (!transaction) throw new Error("This transaction doesn't exists");
        if (transaction && !transaction.tpaga_token)
          throw new Error("This transaction doesn't have tpaga_token");
        return axios
          .get(
            `${config.tpagaApi}/payment_requests/${transaction.tpaga_token}/info`,
            {
              auth: {
                username: config.tpagaUser,
                password: config.tpagaPasswd,
              },
            }
          )
          .then((res) => {
            if (res.response && res.response.data && res.isAxiosError)
              throw new Error(res.response.data.error_messaje);
            if (res && res.data) {
              const tpagaData = res.data;
              if (tpagaData.status && tpagaData.status !== transaction.status) {
                this.mongoDB.update(this.collection, transactionId, {
                  status: tpagaData.status,
                });
              }
              return tpagaData;
            }
          })
          .catch((err) => {
            if (err.isAxiosError) {
              this.mongoDB.update(this.collection, transactionId, {
                status: STRINGS.TRANSACTION_STATUS_FAILED,
              });
            }
            throw new Error(err);
          });
      });
  }

  async refund(transactionId) {
    return this.mongoDB
      .get(this.collection, transactionId)
      .then((transaction) => {
        if (!transaction) throw new Error("This transaction doesn't exists");
        if (transaction && !transaction.tpaga_token)
          throw new Error("This transaction doesn't have tpaga_token");
        return axios
          .post(
            `${config.tpagaApi}/payment_requests/refund`,
            {
              payment_request_token: transaction.tpaga_token,
            },
            {
              auth: {
                username: config.tpagaUser,
                password: config.tpagaPasswd,
              },
            }
          )
          .then((res) => {
            if (res.response && res.response.data && res.isAxiosError)
              throw new Error(res.response.data.error_messaje);
            if (res && res.data) {
              const tpagaData = res.data;
              if (tpagaData.status && tpagaData.status !== transaction.status) {
                this.mongoDB.update(this.collection, transactionId, {
                  status: tpagaData.status,
                });
              }
              return tpagaData;
            }
          });
      });
  }

  async getTransactions() {
    return this.mongoDB.getAll(this.collection);
  }
}

module.exports = TransactionsService;
