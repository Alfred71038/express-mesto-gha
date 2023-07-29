const Card = require('../models/card');

const { ERROR_CODE } = require('../utils/errors');

const NotFound = require('../utils/NotFound');

const ForbiddenError = require('../utils/ForbiddenError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((user) => {
      res.status(ERROR_CODE.SUCCESS_CREATE).send(user);
    })
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.send({ card });
    })
    .catch(next);
};

const deleteCards = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточка не найдена'));
      } if (card.owner.equals(req.user._id)) {
        return card.deleteOne().then(() => res.status(200).send({ message: 'Карточка удалена' }));
        // return Promise.reject(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }
      return next(new ForbiddenError('Вы не можете удалить чужую карточку'));
    })
    .catch(next);
};

const putCardLikes = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточка не найдена'));
      }
      return res.send(card);
    })
    .catch(next);
};

const deleteCardLikes = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  putCardLikes,
  deleteCardLikes,
  deleteCards,
};
