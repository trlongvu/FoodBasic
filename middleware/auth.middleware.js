const jwt = require('jsonwebtoken');
const ErrorResponse = require('../helpers/ErrorResponse');
const AccountModel = require('../models/account.model');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new ErrorResponse(401, 'Invalid Token');
  }

  const token = authorization.split(' ')[1];
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const account = await AccountModel.findById(decode._id);

  if (!account) {
    throw new ErrorResponse(401, 'Unauthorize');
  }

  req.account = account;
  next();
};
