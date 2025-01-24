const express = require('express');
const authRouter = express.Router();

const { register, login } = require('../controllers/auth.controller');
const asyncMiddleware = require('../middleware/async.middleware');

authRouter.route('/register').post(asyncMiddleware(register));

authRouter.route('/login').post(asyncMiddleware(login));

module.exports = authRouter;
