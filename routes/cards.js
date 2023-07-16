const router = require('express').Router();

const {
  createCard,
  getCards,
  putCardLikes,
  deleteCardLikes,
  deleteCards,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCards);
router.put('/:cardId/likes', putCardLikes);
router.delete('/:cardId/likes', deleteCardLikes);

module.exports = router;
