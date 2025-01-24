const express = require('express');
const foodRouter = express.Router();

const {
  createFood,
  getFoods,
  getFood,
  updateFood,
  deleteFood,
} = require('../controllers/food.controller');
const asyncMiddleware = require('../middleware/async.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const Role = require('../middleware/role.middleware');
const typeRoles = require('../constants/type.role');

foodRouter
  .route('/')
  .post(
    asyncMiddleware(authMiddleware),
    Role(typeRoles.ADMIN),
    asyncMiddleware(createFood),
  )
  .get(asyncMiddleware(getFoods));

foodRouter
  .route('/:_id')
  .get(asyncMiddleware(getFood))
  .patch(
    asyncMiddleware(authMiddleware),
    Role(typeRoles.ADMIN),
    asyncMiddleware(updateFood),
  )
  .delete(
    asyncMiddleware(authMiddleware),
    Role(typeRoles.ADMIN),
    asyncMiddleware(deleteFood),
  );

module.exports = foodRouter;
