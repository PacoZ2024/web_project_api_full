const User = require('../models/user');

async function getUsersList(req, res) {
  await User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Error del servidor ${err}` }));
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
      if (err.name === 'CastError') return res.status(400).send({ message: 'Error: ID inválido' });
      return res.status(ERROR_CODE).send({ message: `${err}` });
    });
}

async function createUser(req, res) {
  const { name, about, avatar } = req.body;
  let ERROR_CODE = 500;
  await User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') ERROR_CODE = 400;
      res.status(ERROR_CODE).send({ message: `${err}` });
    });
}

async function updateUser(req, res) {
  const { name, about } = req.body;
  let ERROR_CODE = 500;
  await User.findByIdAndUpdate(
    req.user._id,
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
      res.status(ERROR_CODE).send({ message: `${err}` });
    });
}

async function updateAvatar(req, res) {
  const { avatar } = req.body;
  let ERROR_CODE = 500;
  await User.findByIdAndUpdate(
    req.user._id,
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
      res.status(ERROR_CODE).send({ message: `${err}` });
    });
}

module.exports = {
  getUsersList,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
