const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const userRouter = require('./router/users');
const cardsRouter = require('./router/cards');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/mesto");

app.use((req, res, next) => {
  req.user = {
    _id: '624b10e503bbc8c7df02c031'
  };
  next();
});

app.use(bodyParser.json());
app.use(userRouter);
app.use(cardsRouter);

app.listen(PORT, () => {
  console.log('Server started');
});

