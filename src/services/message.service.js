const Message = require('../models/Message');
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

// LIST FLATS WHERE USER HAS MESSAGES
const getMyConversations = async (userId) => {
  const messages = await Message.find({ senderId: userId })
    .populate("flatId", "title city images")
    .sort({ createdAt: -1 });

  // agrupar por flat
  const map = new Map();

  messages.forEach((msg) => {
    const flat = msg.flatId;
    if (!flat) return;

    if (!map.has(flat._id.toString())) {
      map.set(flat._id.toString(), {
        flat,
        lastMessage: msg.content,
        date: msg.createdAt,
      });
    }
  });

  return Array.from(map.values());
};

module.exports = {
  createMessage,
  listMessagesByFlat,
  deleteMessage,
  getMyConversations,
};

