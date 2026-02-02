const express = require('express');
const router = express.Router();
const flatController = require('../controllers/flatController.js');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadImages = require("../middlewares/upload.middleware");

// CREATE FLAT
router.post("/", authMiddleware, upload.array("images", 5), flatController.createFlat);

// UPDATE FLAT
router.patch("/:id", authMiddleware, upload.array("images", 5), flatController.updateFlat);

router.get("/", flatController.listFlats);
router.get("/:id", flatController.getFlatById);
router.delete("/:id", authMiddleware, flatController.deleteFlat);

module.exports = router;
