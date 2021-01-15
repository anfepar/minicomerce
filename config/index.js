require("dotenv").config();

const config = {
  dev: process.env.NODE_ENV !== "production",
  port: process.env.PORT || 3001,
  tpagaApi:
    "https://stag.wallet.tpaga.co/merchants/api/v1/payment_requests/create",
  tpagaUser: process.env.TPAGA_USER,
  tpagaPasswd: process.env.TPAGA_PASSWD,
  cors: process.env.CORS,
  frontendUrl: process.env.FRONTEND_URL,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME
};

module.exports = { config };
