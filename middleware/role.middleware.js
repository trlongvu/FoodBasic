const ErrorResponse = require('../helpers/ErrorResponse');

module.exports = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const account = req.account;
    if (roles.length && !roles.includes(account.role)) {
      throw new ErrorResponse(403, 'Forbidden');
    }
    next();
  };
};
