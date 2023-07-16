const Card = require('../models/card');
const { ERROR_CODE } = require('../utils/errors');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((user) => {
      res.status(ERROR_CODE.SUCCESS_CREATE).send(user);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Введены некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.send({ card });
    })
    .catch(() => {
      res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const putCardLikes = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Данные не найдены' });
      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const deleteCardLikes = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Данные не найдены' });
      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const deleteCards = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Данные не найдены' });
      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  putCardLikes,
  deleteCardLikes,
  deleteCards,
};
