const express = require('express');
const cartRouter = express.Router();

const {
  addToCart,
  deleteCart,
  getCart,
  deleteItem,
} = require('../controllers/cart.controller');

const asyncMiddleware = require('../middleware/async.middleware');

cartRouter.route('/').post(asyncMiddleware(addToCart));
cartRouter.route('/:_id').delete(asyncMiddleware(deleteCart));
cartRouter.route('/account/:account_id').get(asyncMiddleware(getCart));
cartRouter
  .route('/account/:account_id/food/:food_id')
  .delete(asyncMiddleware(deleteItem));

module.exports = cartRouter;
