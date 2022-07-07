const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const userRouter = require('./router/users');
const cardsRouter = require('./router/cards');
const NotFoundError = require('./errors/NotFoundError');
const { login, createUser } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/auth');
const { validateUrl } = require('./utils/utils');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mesto', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl, 'validate'),
  }),
}), createUser);
app.use(isAuthorized, userRouter);
app.use(isAuthorized, cardsRouter);

app.use('*', () => {
  throw new NotFoundError();
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = '500', message = 'На сервере ошибка' } = err;
  if (statusCode) {
    res.status(statusCode).send({ message });
  }
  next();
});

app.listen(PORT);
