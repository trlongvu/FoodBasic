const express = require('express');
const accountRouter = express.Router();

const {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
} = require('../controllers/account.controller');

const asyncMiddleware = require('../middleware/async.middleware');

accountRouter
  .route('/')
  .post(asyncMiddleware(createAccount))
  .get(asyncMiddleware(getAccounts));

accountRouter
  .route('/:_id')
  .get(asyncMiddleware(getAccount))
  .patch(asyncMiddleware(updateAccount))
  .delete(asyncMiddleware(deleteAccount));

module.exports = accountRouter;
