const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const User = require('../models/user');

const ConflictError = require('../utils/ConflictError');

const UnauthorizedError = require('../utils/UnauthоrizedError');

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

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      } else {
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (matched) {
              const token = jwt.sign(
                { id: user._id },
                'super_strong_password',
                { expiresIn: '7d' },
              );
              res.cookie('jwt', token, {
                maxAge: 3600000 * 24 * 7,
                httpOnly: true,
                sameSite: true,
              });
              const {
                _id, name, about, avatar,
              } = user;
              res.send({
                _id, name, about, avatar, email,
              });
            } else {
              throw new UnauthorizedError('Неправильные почта или пароль');
            }
          })
          .catch(next);
      }
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id).select('+email')
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => (res.send(user)))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => (res.send(user)))
    .catch(next);
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
