class BadRequestError extends Error {
  constructor(message = 'Некорректные данные') {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
