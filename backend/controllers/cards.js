const Card = require('../models/card');

async function getCardsList(req, res) {
  await Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Error del servidor ${err}` }));
}

async function createCard(req, res) {
  const { name, link } = req.body;
  let ERROR_CODE = 500;
  await Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') ERROR_CODE = 400;
      res.status(ERROR_CODE).send({ message: `${err}` });
    });
}

async function deleteCard(req, res) {
  const { cardId } = req.params;
  let ERROR_CODE = 500;
  await Card.findByIdAndDelete(cardId)
    .orFail(() => {
      const error = new Error('No se ha encontrado ninguna tarjeta con esa ID');
      ERROR_CODE = 404;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Error: ID inválido' });
      return res.status(ERROR_CODE).send({ message: `${err}` });
    });
}

async function likeCard(req, res) {
  const { cardId } = req.params;
  let ERROR_CODE = 500;
  await Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('No se ha encontrado ninguna tarjeta con esa ID');
      ERROR_CODE = 404;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Error: ID inválido' });
      return res.status(ERROR_CODE).send({ message: `${err}` });
    });
}

async function dislikeCard(req, res) {
  const { cardId } = req.params;
  let ERROR_CODE = 500;
  await Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('No se ha encontrado ninguna tarjeta con esa ID');
      ERROR_CODE = 404;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Error: ID inválido' });
      return res.status(ERROR_CODE).send({ message: `${err}` });
    });
}

module.exports = {
  getCardsList,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
