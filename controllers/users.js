const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: "На сервере произошла ошибка", err }));
};

const getUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(404).send({message: "Пользователь с таким id не найден"});
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => res.status(500).send({ message: "На сервере произошла ошибка", err }));
};

const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
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
    .catch((err) => res.status(500).send({ message: "На сервере произошла ошибка", err }));
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "На сервере произошла ошибка", err }));
};

module.exports = { getUsers, getUser, createUser, updateUser, updateAvatar };