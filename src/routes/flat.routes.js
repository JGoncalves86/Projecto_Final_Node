const express = require('express');
const router = express.Router();

const flatController = require('../controllers/flatController');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// CREATE FLAT (owner = logged in user)
router.post(
  '/',
  authMiddleware,
  upload.array('images', 5), // máximo 5 imagens
  flatController.createFlat
);

// UPDATE FLAT (adicionar novas imagens)
router.put(
  '/:id',
  authMiddleware,
  upload.array('images', 5),
  flatController.updateFlat
);

router.get('/', flatController.listFlats);
router.get('/:id', flatController.getFlatById);
router.delete('/:id', authMiddleware, flatController.deleteFlat);

module.exports = router;
