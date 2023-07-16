const router = require('express').Router();

const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/:userId', getUser);
router.get('/', getUsers);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
