const User = require('../models/user');
const { ERROR_CODE } = require('../utils/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(ERROR_CODE.SUCCESS_CREATE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Данные не найдены' });
      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Введены некорректные данные при редактировании профиля' });
      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Введены некорректные данные при редактировании аватара' });
      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
};
