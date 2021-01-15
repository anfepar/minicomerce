const axios = require("axios");
const { config } = require("../config/index");
const products = require("../models/products.json");
var hash = require("object-hash");

class PaymentService {
  async generatePayment(productId, quantity, clientIp) {
    const product = products.find((product) => product.id === productId);
    const totalPrice = product.price * quantity;
    const currentDate = new Date();
    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const idempotencyToken = hash({ productId, currentDate });
    
    return axios
      .post(
        config.tpaga_api,
        {
          cost: totalPrice,
          idempotency_token: idempotencyToken,
          order_id: "0001",
          terminal_id: "web_page",
          user_ip_address: clientIp,
          purchase_details_url: "https://www.example.com",
          purchase_description: product.name,
          expires_at: expirationDate,
        },
        {
          auth: {
            username: config.tpaga_user,
            password: config.tpaga_passwd,
          },
        }
      )
      .then((res) => {
        if (res && res.data) {
          return res.data;
        }
      });
  }
}

module.exports = PaymentService;
