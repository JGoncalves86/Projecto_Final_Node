const messageService = require('../services/message.service');
const { createMessageSchema } = require('../validations/message.validation');

// CREATE MESSAGE
const createMessage = async (req, res, next) => {
  try {
    const { error } = createMessageSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const data = { ...req.body, senderId: req.user.id };
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

module.exports = {
  createMessage,
  listMessagesByFlat,
  deleteMessage,
};
