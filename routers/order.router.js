const express = require('express');
const routerOrder = express.Router();

const {
  createOrder,
  getOrder,
  getOrderByAccount,
} = require('../controllers/order.controller');
const asyncMiddleware = require('../middleware/async.middleware');

routerOrder
  .route('/')
  .post(asyncMiddleware(createOrder))
  .get(asyncMiddleware(getOrder));

routerOrder.route('/:account_id').get(asyncMiddleware(getOrderByAccount));

module.exports = routerOrder;
