const express = require("express");
const router = express.Router();
const flatController = require("../controllers/flatController");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// Todas as rotas exigem JWT
router.use(authMiddleware);

// Criar Flat com múltiplas imagens
router.post("/", upload.array("images", 5), flatController.addFlat); // até 5 imagens

// Atualizar Flat (também pode atualizar imagens)
router.patch("/:id", upload.array("images", 5), flatController.updateFlat);

router.get("/", flatController.getAllFlats);
router.get("/:id", flatController.getFlatById);
router.delete("/:id", flatController.deleteFlat);

module.exports = router;


