require("dotenv").config();

const config = {
  dev: process.env.NODE_ENV !== "production",
  port: process.env.PORT || 3000,
  tpaga_api:"https://stag.wallet.tpaga.co/merchants/api/v1/payment_requests/create",
  tpaga_user:process.env.TPAGA_USER,
  tpaga_passwd:process.env.TPAGA_PASSWD,
};

module.exports = { config };
