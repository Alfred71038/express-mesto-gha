const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const User = require('../models/user');

const ConflictError = require('../utils/ConflictError');

const BadRequest = require('../utils/BadRequest');

const { ERROR_CODE } = require('../utils/errors');

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          // eslint-disable-next-line no-param-reassign
          user.password = undefined;
          res.status(ERROR_CODE.SUCCESS_CREATE).send(user);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(
              new BadRequest(
                'Переданы некорректные данные при создании пользователя',
              ),
            );
          } else if (err.code === 11000) {
            next(
              new ConflictError('Пользователь с таким email уже существует'),
            );
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { id: user._id },
        'super-secret-key',
        { expiresIn: '7d' },
      );
      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ _id: user._id });
    })
    .catch(next);
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

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id).select('+email')
    .then((user) => { res.send(user); })
    .catch(next);
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
  getUserInfo,
  updateUser,
  updateAvatar,
  login,
};
