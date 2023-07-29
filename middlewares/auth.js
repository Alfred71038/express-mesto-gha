const jwt = require('jsonwebtoken');

const UnautherizedError = require('../utils/UnautherizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  if (!token) {
    return next(new UnautherizedError('Неверный логин или пароль'));
  }
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new UnautherizedError('Неверный логин или пароль'));
  }
  req.user = payload;
  return next();
};
