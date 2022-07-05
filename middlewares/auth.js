const AuthorizationError = require("../errors/AuthorizationError");
const { checkToken } = require("../helpers/jwt");
const User = require("../models/user");

const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    throw new AuthorizationError('Необходимо авторизоваться');
  }
  const token = auth.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    User.findOne({ id: payload })
      .then((user) => {
        if (!user) {
          throw new AuthorizationError('Необходимо авторизоваться');
        }
        next();
      });
  } catch (err) {
    throw new AuthorizationError('Необходимо авторизоваться');
  }
};

module.exports = { isAuthorized };