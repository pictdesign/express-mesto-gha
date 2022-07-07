const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const { validateUrl } = require('../utils/utils');
const AuthorizationError = require('../errors/AuthorizationError');

const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: { validator: validateUrl, message: 'Введите правильный URL' },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Неверный email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError();
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError();
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', UserSchema);
