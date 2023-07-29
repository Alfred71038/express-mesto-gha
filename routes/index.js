const router = require('express').Router();
const auth = require('../middlewares/auth');
const celebrate = require('../middlewares/celebrate');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');

router.post('/signup', celebrate.createUser, createUser);
router.post('/signin', celebrate.login, login);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
