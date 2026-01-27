const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// ==========================
// PUBLIC ROUTES
// ==========================
router.post('/register', userController.register);
router.post('/login', userController.login);

// ==========================
// AUTHENTICATED USER
// ==========================
router.get('/me', authMiddleware, userController.getProfile);

router.put('/me', authMiddleware, userController.updateProfile);

// ==========================
// FAVORITES
// ==========================
router.post(
  '/favorites/:flatId',
  authMiddleware,
  userController.addFavorite
);

router.delete(
  '/favorites/:flatId',
  authMiddleware,
  userController.removeFavorite
);

// ==========================
// ADMIN ONLY
// ==========================
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  userController.listUsers
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

module.exports = router;
