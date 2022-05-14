const User = require("../models/user");
const {NotFoundError, BadRequestError} = require("../errors/errors");

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => next(err));
};

const getUser = (req, res, next) => {
  User.findById({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then((user) => res.status(201).send({data: user, message: 'Пользователь создан' }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

const updateUser = async (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { name: name, about: about }, { new: true, runValidators: true });
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send({ user });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError());
    } else {
      next(err);
    }
  }
};

const updateAvatar = async (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true });
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send({ user });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError());
    } else {
      next(err);
    }
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, updateAvatar };