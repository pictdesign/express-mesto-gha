const Error = require("../middleware/error");

const NotFoundError = (message) => Error(404, message);

module.exports = { NotFoundError };