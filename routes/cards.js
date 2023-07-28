const router = require('express').Router();

const celebrate = require('../middlewares/celebrate');

const {
  createCard,
  getCards,
  deleteCards,
  putCardLikes,
  deleteCardLikes,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate.createCard, createCard);
router.delete('/:cardId', celebrate.getCardId, deleteCards);
router.put('/:cardId/likes', celebrate.getCardId, putCardLikes);
router.delete('/:cardId/likes', celebrate.getCardId, deleteCardLikes);

module.exports = router;
