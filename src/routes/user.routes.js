const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth.middleware");

// ======================
// ROTAS PÚBLICAS
// ======================
router.post("/register", userController.register);
router.post("/login", userController.login);

// ======================
// ROTAS PROTEGIDAS (exigem JWT)
// ======================
router.use(authMiddleware);

router.get("/profile", userController.getProfile);
router.get("/", userController.getAllUsers);        // só admin deve usar
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// FAVORITOS
router.post("/favorites/:flatId", userController.toggleFavorite);
router.get("/favorites", userController.getUserFavorites);

module.exports = router;
