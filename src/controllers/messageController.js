const messageService = require('../services/message.service');
const { createMessageSchema } = require('../validations/message.validation');

// CREATE MESSAGE
const createMessage = async (req, res, next) => {
  try {
    const { error } = createMessageSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const data = {
  flatId: req.body.flatId,
  content: req.body.content,
  senderId: req.user.id,
  receiverId: req.body.receiverId,
};
    const message = await messageService.createMessage(data);

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

// LIST MESSAGES BY FLAT
const listMessagesByFlat = async (req, res, next) => {
  try {
    const flatId = req.params.flatId;
    const messages = await messageService.listMessagesByFlat(flatId);

    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

// DELETE MESSAGE
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

// GET MY CONVERSATIONS (Flats where I sent messages)
const getMyConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await messageService.getMyConversations(userId);

    res.status(200).json(conversations);
  } catch (err) {
    next(err);
  }
};

// GET UNREAD COUNT
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const count = await messageService.getUnreadCount(userId);

    res.status(200).json({ unread: count });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  createMessage,
  listMessagesByFlat,
  deleteMessage,
  getMyConversations,
  getUnreadCount, // ✅
};


