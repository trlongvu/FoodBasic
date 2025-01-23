const accountRouter = require('./account.router');

const ErrorHandle = require('../middleware/error.handle');

module.exports = (app) => {
  app.use('/api/accounts', accountRouter);

  app.use(ErrorHandle);
};
