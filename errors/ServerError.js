const Error = require("../middleware/error");

const ServerError = (err) => Error(500, 'Произошла ошибка', err);

module.exports = { ServerError };