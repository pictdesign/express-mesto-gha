const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./router/users');
const cardsRouter = require('./router/cards');
const NotFoundError = require('./errors/NotFoundError');
const { login, createUser } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/auth');

const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/mesto', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(isAuthorized, userRouter);
app.use(isAuthorized, cardsRouter);

app.use('*', () => {
  throw new NotFoundError();
});

app.use((err, req, res, next) => {
  const { statusCode = '500', message = 'На сервере ошибка'} = err;
  if(statusCode) {
    res.status(statusCode).send({ message: message });
  }
  next();
});

app.listen(PORT);
