const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

// -------------------
// Public routes
// -------------------
router.post("/register", userController.register);
router.post("/login", userController.login);

// -------------------
// Protected routes
// -------------------
router.get("/profile", auth, userController.getProfile); // opcional

// Favorites routes (antes de /:id!)
router.post("/favorites/:flatId", auth, userController.toggleFavorite);
router.get("/favorites", auth, userController.getUserFavorites);

// CRUD Users
router.get("/", auth, adminMiddleware, userController.getAllUsers);
router.get("/:id", auth, userController.getUserById);
router.patch("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
