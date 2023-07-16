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
router.put('/:cardId/likes', putCardLikes);
router.delete('/:cardId/likes', deleteCardLikes);
router.delete('/:cardId', deleteCards);

module.exports = router;
