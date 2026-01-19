const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Se requiere el correo electrónico del usuario'],
    unique: [true, 'Ya existe un usuario con ese correo electrónico'],
    validate: {
      validator: validator.isEmail,
      message: 'Correo electrónico inválido',
    },
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Se requiere una contraseña'],
    minlength: [8, 'La longitud mínima de la contraseña es de ocho caracteres'],
  },
  name: {
    type: String,
    default: 'Jacques Cousteau',
    minlength: [2, 'La longitud mínima del nombre es de dos caracteres'],
    maxlength: [30, 'La longitud máxima del nombre es de 30 caracteres'],
  },
  about: {
    type: String,
    default: 'Explorador',
    minlength: [
      2,
      'La longitud mínima para la descripción del usuario es de dos caracteres',
    ],
    maxlength: [
      30,
      'La longitud máxima para la descripción del usuario es de 30 caracteres',
    ],
  },
  avatar: {
    type: String,
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
    validate: {
      validator: validator.isURL,
      message: (props) => `La dirección ${props.value} no es de una URL válida`,
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Contraseña o correo electrónico incorrecto');
    })
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new UnauthorizedError(
          'Contraseña o correo electrónico incorrecto',
        );
      }
      return user;
    }));
};

module.exports = mongoose.model('user', userSchema);
