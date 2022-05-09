const Error = (err, status, errMessage) => {
  res.status(status).send({ message: errMessage, err });
};

module.exports = { Error };