const Message = require('../models/Message');
const Flat = require('../models/Flat');
const User = require('../models/User');

const createMessage = async (data) => {
  const { flatId, senderId, receiverId, content } = data;

  const flat = await Flat.findById(flatId);
  if (!flat) throw new Error("Flat not found");

  const sender = await User.findById(senderId);
  if (!sender) throw new Error("Sender not found");

  const receiver = await User.findById(receiverId);
  if (!receiver) throw new Error("Receiver not found");

  const message = await Message.create({
    flatId,
    senderId,
    receiverId,
    content,
  });

  return message;
};


const listMessagesByFlat = async (flatId) => {
  const messages = await Message.find({ flatId })
    .populate('senderId', 'firstName lastName email')
    .populate('receiverId', 'firstName lastName email')
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
  const messages = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  })
    .populate("senderId", "firstName lastName email")
    .populate("receiverId", "firstName lastName email")
    .populate("flatId", "city streetName");

  const grouped = {};

  messages.forEach((msg) => {
    const flatKey = msg.flatId._id.toString();

    if (!grouped[flatKey]) {
      grouped[flatKey] = {
        flat: msg.flatId,
        messages: [],
      };
    }

    grouped[flatKey].messages.push(msg);
  });

  return Object.values(grouped);
};

// COUNT UNREAD MESSAGES FOR USER
const getUnreadCount = async (userId) => {
  const count = await Message.countDocuments({
    receiverId: userId,
    isRead: false,
  });

  return count;
};

// MARK MESSAGES AS READ IN A FLAT
const markFlatMessagesAsRead = async (flatId, userId) => {
  const result = await Message.updateMany(
    {
      flatId: flatId,
      receiverId: userId,
      isRead: false,
    },
    {
      $set: { isRead: true },
    }
  );

  return {
    message: "Messages marked as read",
    updated: result.modifiedCount,
  };
};



module.exports = {
  createMessage,
  listMessagesByFlat,
  deleteMessage,
  getMyConversations,
  getUnreadCount,
  markFlatMessagesAsRead, // ✅ NEW
};


