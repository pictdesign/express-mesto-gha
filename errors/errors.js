class ServerError extends Error {
  constructor (message = "На сервере произошла ошибка") {
    super(message);
    this.statusCode = 500;
  }
}

class NotFoundError extends Error {
  constructor (message = "Страница не найдена") {
    super(message);
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  constructor (message = "Некорректные данные") {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = { ServerError, NotFoundError, BadRequestError};