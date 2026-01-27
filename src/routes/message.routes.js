const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/auth.middleware');

// CREATE MESSAGE
router.post('/', authMiddleware, messageController.createMessage);

// LIST MESSAGES BY FLAT
router.get('/flat/:flatId', messageController.listMessagesByFlat);

// DELETE MESSAGE
router.delete('/:id', authMiddleware, messageController.deleteMessage);

module.exports = router;
