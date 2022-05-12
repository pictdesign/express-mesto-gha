const express = require("express");
const router = express.Router();
const { getUsers, getUser, getMe, createUser, updateUser, updateAvatar } = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.post('/users', createUser);

router.get('/me', getMe);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;