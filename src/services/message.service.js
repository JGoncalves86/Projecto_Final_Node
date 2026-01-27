const Message = require('../models/message');
const Flat = require('../models/Flat');
const User = require('../models/User');

const createMessage = async (data) => {
  const { flatId, senderId, content } = data;

  // verifica se flat existe
  const flat = await Flat.findById(flatId);
  if (!flat) throw new Error('Flat not found');

  // verifica se sender existe
  const sender = await User.findById(senderId);
  if (!sender) throw new Error('Sender not found');

  const message = await Message.create({ flatId, senderId, content });
  return message;
};

const listMessagesByFlat = async (flatId) => {
  const messages = await Message.find({ flatId })
    .populate('senderId', 'firstName lastName email')
    .sort({ createdAt: 1 });

  return messages;
};

const deleteMessage = async (messageId, userId, isAdmin = false) => {
  const message = await Message.findById(messageId);
  if (!message) throw new Error('Message not found');

  if (!isAdmin && message.senderId.toString() !== userId) {
    throw new Error('Access denied. Only sender or admin can delete.');
  }

  await message.remove();
  return { message: 'Message deleted successfully' };
};

module.exports = {
  createMessage,
  listMessagesByFlat,
  deleteMessage,
};
