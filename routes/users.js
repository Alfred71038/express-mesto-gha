const router = require('express').Router();

const celebrate = require('../middlewares/celebrate');

const {
  getUser,
  getUsers,
  getUserInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/:userId', celebrate.getUser, getUser);
router.get('/', getUsers);
router.get('/me', getUserInfo);
router.patch('/me', celebrate.updateUser, updateUser);
router.patch('/me/avatar', celebrate.updateAvatar, updateAvatar);

module.exports = router;
