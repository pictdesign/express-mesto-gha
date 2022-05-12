const User = require("../models/user");
const {ServerError, NotFoundError, BadRequest} = require("../errors/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(ServerError).send({ message: "На сервере произошла ошибка" }));
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).send({message: "Пользователь с таким id не найден"});
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => res.status(BadRequest).send({ message: "На сервере произошла ошибка" }));
};

const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then((user) => res.status(201).send({data: user, message: 'Пользователь создан' }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BadRequest).send({ message: "Некорректные данные" });
      } else {
        res.status(BadRequest).send({ message: "На сервере произошла ошибка" });
      }
    });
};

const getMe = (req, res) => {
  const userId = req.user._id;
  User.findById({ _id: userId })
    .then((user) => {
      if (!user) {
        res.status(BadRequest).send({message: "Пользователь с таким id не найден"});
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => res.status(BadRequest).send({ message: "На сервере произошла ошибка" }));
};

const updateUser = async (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { name, about }, { new: true });
    if (!user) {
      res.status(NotFoundError).send({ message: "Пользователь не найден"});
    }
    res.status(200).send({ user });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(BadRequest).send({ message: "Некорректные данные" });
    } else {
      res.status(BadRequest).send({ message: "На сервере произошла ошибка" });
    }
  }
};

const updateAvatar = async (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { avatar }, { new: true });
    if (!user) {
      res.status(NotFoundError).send({ message: "Пользователь не найден"});
    }
    res.status(200).send({ user });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(BadRequest).send({ message: "Некорректные данные" });
    } else {
      res.status(BadRequest).send({ message: "На сервере произошла ошибка" });
    }
  }
};

module.exports = { getUsers, getUser, getMe, createUser, updateUser, updateAvatar };