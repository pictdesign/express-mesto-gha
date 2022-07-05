const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const DuplicateError = require('../errors/DuplicateError');
const { generateToken, checkToken } = require('../helpers/jwt');

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
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

const getMe = (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth.replace('Bearer ', '');
  const payload = checkToken(token);
  const id = payload.payload;
  User.findById({ _id: id })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Нужны логин и пароль');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(201).send(user))
        .catch((err) => {
          if (err.code === 11000) {
            next(new DuplicateError());
          } else {
            next(err);
          }
        });
    });
};

const updateUser = async (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError());
    } else {
      next(err);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError());
    } else {
      next(err);
    }
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Нужны логин и пароль');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken(user.id);
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).end();
    })
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
  getUser,
  getMe,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
