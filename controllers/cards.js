const Card = require('../models/card');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

async function getCardsList(req, res, next) {
  await Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
}

async function createCard(req, res, next) {
  const { name, link } = req.body;
  const userId = req.user._id;
  await User.findById(userId)
    .then((user) => {
      Card.create({ name, link, owner: user._id })
        .then((card) => res.status(201).send(card))
        .catch((err) => {
          if (err.name === 'ValidationError') throw new BadRequestError(err.message);
          next(err);
        })
        .catch(next);
    })
    .catch(() => {
      throw new NotFoundError(
        'El usuario que quiere crear la tarjeta no esta registrado',
      );
    })
    .catch(next);
}

async function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;
  await Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('No se ha encontrado ninguna tarjeta con esa ID');
    })
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError(
          'No tienes permisos para eliminar esta tarjeta',
        );
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then((card) => {
      res.send({ message: 'Tarjeta eliminada', data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') throw new BadRequestError('ID de tarjeta inválido');
      next(err);
    })
    .catch(next);
}

async function likeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;
  await User.findById(userId)
    .then((user) => {
      Card.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: user._id } },
        { new: true },
      )
        .orFail(() => {
          throw new NotFoundError(
            'No se ha encontrado ninguna tarjeta con esa ID',
          );
        })
        .then((card) => res.send(card))
        .catch((err) => {
          if (err.name === 'CastError') throw new BadRequestError('ID de tarjeta inválido');
          next(err);
        })
        .catch(next);
    })
    .catch(() => {
      throw new NotFoundError(
        'El usuario que quiere dar like a la tarjeta no esta registrado',
      );
    })
    .catch(next);
}

async function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;
  await Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('No se ha encontrado ninguna tarjeta con esa ID');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') throw new BadRequestError('ID de tarjeta inválido');
      next(err);
    })
    .catch(next);
}

module.exports = {
  getCardsList,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
