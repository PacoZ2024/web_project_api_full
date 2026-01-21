const router = require('express').Router();
const { validateCard, validateCardId } = require('../middleware/validation');
const {
  getCardsList,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCardsList);

router.post('/', validateCard, createCard);

router.delete('/:cardId', validateCardId, deleteCard);

router.put('/:cardId/likes', validateCardId, likeCard);

router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
