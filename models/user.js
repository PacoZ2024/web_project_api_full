const mongoose = require('mongoose');

// eslint-disable-next-line
const regex = /^https?:\/\/(www\.)?[A-Za-z0-9\._~:\/?%#\[\]@!$&'\(\)\*\+,;=]/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Se requiere el nombre del usuario'],
    minlength: [2, 'La longitud mínima del nombre es de dos caracteres'],
    maxlength: [30, 'La longitud máxima del nombre es de 30 caracteres'],
  },
  about: {
    type: String,
    required: [true, 'Se requiere la descripción del usuario'],
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
    required: [true, 'Se requiere una dirección URL para la imagen del avatar'],
    validate: {
      validator(v) {
        return regex.test(v);
      },
      message: (props) => `La dirección ${props.value} no es de una URL válida`,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
