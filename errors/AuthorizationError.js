class AuthorizationError extends Error {
  constructor(message = 'Неправильный логин или пароль') {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = AuthorizationError;
