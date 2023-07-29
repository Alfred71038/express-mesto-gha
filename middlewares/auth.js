const jwt = require('jsonwebtoken');

const UnautherizedError = require('../utils/UnautherizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnautherizedError('Неверный логин или пароль'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super_strong_password');
  } catch (err) {
    return next(new UnautherizedError('Неверный логин или пароль'));
  }
  req.user = payload;
  return next();
};
