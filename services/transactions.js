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
      status: STRINGS.TRANSACTION_STATUS_PENDING,
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
              purchase_details_url: `${config.frontendUrl}/transaction/${transactionId}`,
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
              status: STRINGS.TRANSACTION_STATUS_DECLINED,
            });
            throw new Error(error);
          });
      });
  }
}

module.exports = TransactionsService;
