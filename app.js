const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const userRouter = require('./router/users');
const cardsRouter = require('./router/cards');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

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
  res.status(404).send({message: 'Страница не найдена'});
});

app.listen(PORT, () => {
  console.log('Server started');
});

