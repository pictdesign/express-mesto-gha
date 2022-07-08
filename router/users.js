const express = require('express');
const {
  getUsers, getUser, getMe, updateUser, updateAvatar, logout,
} = require('../controllers/users');

const router = express.Router();

router.get('/signout', logout);

router.get('/users', getUsers);

router.get('/users/me', getMe);

router.get('/users/:id', getUser);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
