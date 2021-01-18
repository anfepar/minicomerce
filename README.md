# minicomerce
This is a minicommerce who use the TPaga API to complete de payment
This repo is API developed with Node.js and Express 
Estimated time: 30 hours

You could test it using the following link https://mighty-woodland-62043.herokuapp.com/api  and the endpoints `POST /transacitons/generatePayment` with the parameters `product:"0001"` and `quantity:$QUANTITY_NUMBER` , `GET /transactions/checkPayment/:id`, `GET /transactions` and `POST /transactions/refund` with the parameter `transactionId`

## Getting started

Steps:

1. clone this repository 
2. install npm dependencies with `npm install`
3. create a `.env` file using the same variable names defined in `.env.example`
4. run the server with `npm run start`
5. use the api using the url `http://localhost:$PORT`

## Frontend Repository

 👁️ https://github.com/anfepar/minicommerce-front
