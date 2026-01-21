const router = require('express').Router();
const {
  validateUserId,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middleware/validation');
const {
  getUsersList,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsersList);

router.get('/me', getCurrentUser);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUpdateUser, updateUser);

router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
