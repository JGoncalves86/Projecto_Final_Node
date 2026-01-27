const express = require("express");
const router = express.Router();
const flatController = require("../controllers/flatController");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// 🔐 TODAS as rotas exigem autenticação
router.use(authMiddleware);

// Criar flat
router.post("/", upload.array("images", 5), flatController.addFlat);

// Atualizar flat
router.put("/:id", upload.array("images", 5), flatController.updateFlat);

// Listar flats
router.get("/", flatController.getAllFlats);

// Ver flat
router.get("/:id", flatController.getFlatById);

// Apagar flat
router.delete("/:id", flatController.deleteFlat);

module.exports = router;

