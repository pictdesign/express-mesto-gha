const User = require("../models/user");
const { ServerError } = require("../errors/ServerError");
const { NotFoundError } = require("../errors/NotFoundError");

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {throw new ServerError(err)});
};

const getUser = (req, res) => {
  return User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(200).send({message: "Пользователь с таким id не найден"});
      }
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: "На сервере произошла ошибка", err }));
};

const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  return User.create({name, about, avatar})
    .then((user) => res.status(201).send({data: user, message: 'Пользователь создан' }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Некорректные данные" });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .then((user) => res.send({ data: user}))
    .catch((err) => {throw new ServerError(err)});
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {throw new ServerError(err)});
};

module.exports = { getUsers, getUser, createUser, updateUser, updateAvatar };