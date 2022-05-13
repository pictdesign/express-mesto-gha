const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const userRouter = require('./router/users');
const cardsRouter = require('./router/cards');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const { NotFoundError } = require("./errors/errors");

mongoose.connect("mongodb://localhost:27017/mesto", {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '624b147ad24f948d4159391c'
  };
  next();
});

app.use(bodyParser.json());
app.use(userRouter);
app.use(cardsRouter);
app.use('*', (req, res) => {
  throw new NotFoundError();
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log('Server started');
});

