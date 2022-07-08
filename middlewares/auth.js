const AuthorizationError = require('../errors/AuthorizationError');
const { checkToken } = require('../helpers/jwt');
const User = require('../models/user');

const isAuthorized = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new AuthorizationError('Необходимо авторизоваться');
  }
  try {
    const payload = checkToken(jwt);
    User.findOne({ id: payload })
      .then((user) => {
        if (!user) {
          throw new AuthorizationError('Необходимо авторизоваться');
        }
        req.user = payload;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    throw new AuthorizationError('Необходимо авторизоваться');
  }
};

module.exports = { isAuthorized };
