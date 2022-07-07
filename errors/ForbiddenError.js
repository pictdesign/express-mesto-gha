class ForbiddenError extends Error {
  constructor(message = 'Вы не можете удалить эту карточку') {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
