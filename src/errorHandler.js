const logger = require('./logger');

module.exports = app.use(function errorHandler(error, req, res, next) {
  //Our production applications should hide error messages from users 

  let reply;
  if (NODE_ENV === 'production') {
    reply = { error: { message: 'server error' } };
  } else {
    console.error(error);
    reply = { message: error.message, error };
  }
  res.status(500).json(reply);
});
