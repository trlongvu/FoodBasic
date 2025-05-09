const express = require('express');
const categoryRouter = express.Router();

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const asyncMiddleware = require('../middleware/async.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const Role = require('../middleware/role.middleware');
const typeRoles = require('../constants/type.role');

categoryRouter
  .route('/')
  .post(
    asyncMiddleware(authMiddleware),
    Role(typeRoles.ADMIN),
    asyncMiddleware(createCategory),
  )
  .get(asyncMiddleware(getCategories));

categoryRouter
  .route('/:_id')
  .get(asyncMiddleware(getCategory))
  .patch(
    asyncMiddleware(authMiddleware),
    Role(typeRoles.ADMIN),
    asyncMiddleware(updateCategory),
  )
  .delete(
    asyncMiddleware(authMiddleware),
    Role(typeRoles.ADMIN),
    asyncMiddleware(deleteCategory),
  );

module.exports = categoryRouter;
