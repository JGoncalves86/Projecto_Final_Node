const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const userService = require('../services/user.service');
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

router.patch('/me', authMiddleware, userController.updateProfile);

// ==========================
// FAVORITES
// ==========================
router.get("/me/favourites", authMiddleware, userController.getMyFavourites);

router.post(
  "/me/favourites/:flatId",
  authMiddleware,
  userController.addFavouriteFlat
);


router.delete(
  '/me/favourites/:flatId',
  authMiddleware,
  userController.removeFavouriteFlat    
);

// ==========================
// ADMIN ONLY
// ==========================
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  userService.listAllUsers
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  userService.deleteUser
);

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.updateUserByAdmin
);


module.exports = router;
