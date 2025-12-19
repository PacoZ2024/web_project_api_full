const router = require('express').Router();
const {
  getUsersList,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsersList);

router.get('/:id', getUserById);

router.post('/', createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
