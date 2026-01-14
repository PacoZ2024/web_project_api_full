const validator = require('validator');
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Se requiere el nombre de la tarjeta'],
    minlength: [
      2,
      'La longitud mínima del nombre de la tarjeta es de dos caracteres',
    ],
    maxlength: [
      30,
      'La longitud máxima del nombre de la tarjeta es de 30 caracteres',
    ],
  },
  link: {
    type: String,
    required: [true, 'Se requiere el vínculo a la imagen de la tarjeta'],
    validate: {
      validator: validator.isURL,
      message: (props) => `La dirección ${props.value} no es de una URL válida`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Se requiere un usuario como propietario de la tarjeta'],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
