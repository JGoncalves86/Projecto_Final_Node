const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const authMiddleware = require("../middlewares/auth.middleware");

// CREATE MESSAGE
router.post("/", authMiddleware, messageController.createMessage);

// LIST MESSAGES BY FLAT
router.get("/flat/:flatId", authMiddleware, messageController.listMessagesByFlat);

// DELETE MESSAGE
router.delete("/:id", authMiddleware, messageController.deleteMessage);

// GET MY CONVERSATIONS
router.get(
  "/me/conversations",
  authMiddleware,
  messageController.getMyConversations
);

// UNREAD COUNT
router.get(
  "/me/unread-count",
  authMiddleware,
  messageController.getUnreadCount
);



module.exports = router;
