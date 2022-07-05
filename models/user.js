const mongoose = require('mongoose');
const validator = require('validator');
const AuthorizationError = require('../errors/AuthorizationError');
const bcrypt = require('bcryptjs');

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
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password : {
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
          if(!matched) {
            throw new AuthorizationError();
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', UserSchema);
