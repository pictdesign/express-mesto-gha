class DuplicateError extends Error {
  constructor(message = 'Такая почта уже занята') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = DuplicateError;
