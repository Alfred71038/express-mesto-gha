const jwt = require('jsonwebtoken');

const UnautherizedError = require('../utils/UnautherizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnautherizedError('Неверный логин или пароль'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new UnautherizedError('Неверный логин или пароль'));
  }

  req.user = payload;

  return next();
};
