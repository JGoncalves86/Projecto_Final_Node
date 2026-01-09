const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const auth = require("../middlewares/auth.middleware");

router.get(
  "/:id/messages",
  auth,
  messageController.getAllMessages
);

router.get(
  "/:id/messages/:senderId",
  auth,
  messageController.getUserMessages
);

router.post(
  "/:id/messages",
  auth,
  messageController.addMessage
);

module.exports = router;
