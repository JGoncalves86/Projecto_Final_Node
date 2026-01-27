const express = require('express');
const router = express.Router();

const flatController = require('../controllers/flat.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// ==========================
// PUBLIC ROUTES
// ==========================

// List flats with filters, sorting, pagination
router.get('/', flatController.listFlats);

// Get flat by ID
router.get('/:id', flatController.getFlatById);

// ==========================
// PROTECTED ROUTES
// ==========================

// Create flat (owner = logged in user)
router.post('/', authMiddleware, flatController.createFlat);

// Update flat (owner or admin)
router.put('/:id', authMiddleware, flatController.updateFlat);

// Delete flat (owner or admin)
router.delete('/:id', authMiddleware, flatController.deleteFlat);

module.exports = router;
