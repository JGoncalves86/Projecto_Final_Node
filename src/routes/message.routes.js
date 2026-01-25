const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const auth = require("../middlewares/auth.middleware");

router.get(
  "/unread-count",
  auth,
  messageController.getUnreadCount
);

router.get(
  "/:flatId",
  auth,
  messageController.getAllMessages
);

router.get(
  "/:flatId/:senderId",
  auth,
  messageController.getUserMessages
);

router.post(
  "/:flatId",
  auth,
  messageController.addMessage
);

module.exports = router;
