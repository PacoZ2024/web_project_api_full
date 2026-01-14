const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function getUsersList(req, res) {
  await User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `${err.message}` }));
}

async function getUserById(req, res) {
  const { id } = req.params;
  let ERROR_CODE = 500;
  await User.findById(id)
    .orFail(() => {
      const error = new Error('No se ha encontrado ningún usuario con ese ID');
      ERROR_CODE = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'ID de usuario inválido' });
      return res.status(ERROR_CODE).send({ message: `${err.message}` });
    });
}

async function getCurrentUser(req, res) {
  const userId = req.user._id;
  let ERROR_CODE = 500;
  await User.findById(userId)
    .orFail(() => {
      const error = new Error('Usuario no encontrado');
      ERROR_CODE = 404;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      res.status(ERROR_CODE).send({ message: `${err.message}` });
    });
}

async function createUser(req, res) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  let ERROR_CODE = 500;
  if (!password) {
    return res.status(400).send({ message: 'Se requiere una contraseña' });
  }
  if (password.length < 8) {
    return res.status(400).send({
      message: 'La longitud mínima de la contraseña es de ocho caracteres',
    });
  }
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') ERROR_CODE = 400;
      res.status(ERROR_CODE).send({ message: `${err.message}` });
    });
}

async function updateUser(req, res) {
  const currentUserId = req.user._id;
  const { name, about } = req.body;
  let ERROR_CODE = 500;
  await User.findByIdAndUpdate(
    currentUserId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error(
        'No se realizó la actualización del perfil porque no se encontró el ID del usuario',
      );
      ERROR_CODE = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') ERROR_CODE = 400;
      res.status(ERROR_CODE).send({ message: `${err.message}` });
    });
}

async function updateAvatar(req, res) {
  const currentUserId = req.user._id;
  const { avatar } = req.body;
  let ERROR_CODE = 500;
  await User.findByIdAndUpdate(
    currentUserId,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error(
        'No se realizó la actualización del avatar porque no se encontró el ID del usuario',
      );
      ERROR_CODE = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') ERROR_CODE = 400;
      res.status(ERROR_CODE).send({ message: `${err.message}` });
    });
}

async function login(req, res) {
  const { email, password } = req.body;
  await User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: `${err.message}` });
    });
}

module.exports = {
  getUsersList,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
