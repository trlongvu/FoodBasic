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
const authMiddleware = require('../middleware/auth.middleware');
const Role = require('../middleware/role.middleware');
const typeRoles = require('../constants/type.role');

accountRouter
  .route('/')
  .post(asyncMiddleware(createAccount))
  .get(
    asyncMiddleware(authMiddleware),
    Role(typeRoles.ADMIN),
    asyncMiddleware(getAccounts),
  );

accountRouter
  .route('/:_id')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(getAccount))
  .patch(asyncMiddleware(authMiddleware), asyncMiddleware(updateAccount))
  .delete(
    asyncMiddleware(authMiddleware),
    Role(typeRoles.ADMIN),
    asyncMiddleware(deleteAccount),
  );

module.exports = accountRouter;
