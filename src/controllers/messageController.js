const Message = require("../models/Message"); // ✅ IMPORT OBRIGATÓRIO
const messageService = require("../services/message.service");
const { createMessageSchema } = require("../validations/message.validation");

// ==============================
// CREATE MESSAGE
// ==============================
const createMessage = async (req, res, next) => {
  try {
    // validar body
    const { error } = createMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }

    const { content, flatId, receiverId } = req.body;

    // criar mensagem
    const message = await Message.create({
      content,
      flatId,
      senderId: req.user.id,
      receiverId,
    });

    // devolver já com populate
    const populated = await message.populate(
      "senderId receiverId",
      "firstName lastName"
    );

    res.status(201).json({
      status: "success",
      message: populated,
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// LIST MESSAGES BY FLAT
// ==============================
const listMessagesByFlat = async (req, res, next) => {
  try {
    const flatId = req.params.flatId;

    const messages = await Message.find({ flatId })
      .populate("senderId", "firstName lastName")
      .populate("receiverId", "firstName lastName")
      .sort({ createdAt: 1 });

    res.status(200).json({
      status: "success",
      messages,
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// DELETE MESSAGE
// ==============================
const deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;

    const result = await messageService.deleteMessage(
      messageId,
      req.user.id,
      req.user.isAdmin
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// ==============================
// GET MY CONVERSATIONS
// ==============================
const getMyConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await messageService.getMyConversations(userId);

    res.status(200).json({
      status: "success",
      conversations,
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// GET UNREAD COUNT
// ==============================
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const count = await messageService.getUnreadCount(userId);

    res.status(200).json({
      status: "success",
      unread: count,
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// MARK CHAT AS READ
// ==============================
const markAsRead = async (req, res, next) => {
  try {
    const flatId = req.params.flatId;
    const userId = req.user.id;

    const result = await messageService.markFlatMessagesAsRead(flatId, userId);

    res.status(200).json({
      status: "success",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMessage,
  listMessagesByFlat,
  deleteMessage,
  getMyConversations,
  getUnreadCount,
  markAsRead,
};
