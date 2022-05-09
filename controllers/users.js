const path = require('path');
const User = require("../models/user");

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => console.log(err));
};

const getUser = (req, res) => {
  return User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Пользователь с таким id не найден"});
      }
      res.status(200).send(user);
    })
    .catch((err) => console.log(err));
};

const createUser = (req, res) => {
  return User.create({
    ...req.body,
  }).then((user) => res.status(200).send(user))
    .catch((err) => console.log(err));
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .then((user) => res.send({ data: user}))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }))
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = { getUsers, getUser, createUser, updateUser, updateAvatar };