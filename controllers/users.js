require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

async function getUsersList(req, res, next) {
  await User.find({})
    .then((users) => res.send(users))
    .catch(next);
}

async function getUserById(req, res, next) {
  const { userId } = req.params;
  await User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('No se ha encontrado ningún usuario con ese ID');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') throw new BadRequestError('ID de usuario inválido');
      next(err);
    })
    .catch(next);
}

async function getCurrentUser(req, res, next) {
  const currentUserId = req.user._id;
  await User.findById(currentUserId)
    .orFail(() => {
      throw new NotFoundError('Usuario no encontrado');
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
}

async function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password) throw new BadRequestError('Se requiere una contraseña');

  if (password.length < 8) {
    throw new BadRequestError(
      'La longitud mínima de la contraseña debe ser de al menos ocho caracteres',
    );
  }

  await bcrypt
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
      if (err.name === 'ValidationError') throw new BadRequestError(err.message);
      next(err);
    })
    .catch(next);
}

async function updateUser(req, res, next) {
  const currentUserId = req.user._id;
  const { name, about } = req.body;
  await User.findByIdAndUpdate(
    currentUserId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError(
        'No se actualizó el perfil del usuario porque no se encontró el ID',
      );
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') throw new BadRequestError(err.message);
      next(err);
    })
    .catch(next);
}

async function updateAvatar(req, res, next) {
  const currentUserId = req.user._id;
  const { avatar } = req.body;
  await User.findByIdAndUpdate(
    currentUserId,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError(
        'No se actualizó la imagen de perfil del usuario porque no se encontró el ID',
      );
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') throw new BadRequestError(err.message);
      next(err);
    })
    .catch(next);
}

async function login(req, res, next) {
  const { email, password } = req.body;
  await User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch(next);
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
