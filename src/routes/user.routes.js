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

// Perfil do user logado
router.get("/profile", auth, userController.getProfile); // retorna dados do próprio usuário

// Favorites routes (sempre antes de /:id)
router.post("/favorites/:flatId", auth, userController.toggleFavorite);
router.get("/favorites", auth, userController.getUserFavorites);

// CRUD Users (admin only para lista completa)
router.get("/", auth, adminMiddleware, userController.getAllUsers);

// Rotas por ID (deve vir por último)
router.get("/:id", auth, userController.getProfile);
router.patch("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
