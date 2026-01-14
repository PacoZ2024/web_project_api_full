const router = require('express').Router();
const {
  getUsersList,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsersList);

router.get('/me', getCurrentUser);

router.get('/:id', getUserById);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
