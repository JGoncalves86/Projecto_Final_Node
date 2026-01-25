const Message = require("../models/Message");
const Flat = require("../models/Flat");

// GET all messages of a flat (only owner or admin)
exports.getAllMessages = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    // Apenas o dono do flat ou admin podem ver todas as mensagens
    if (req.user.id !== flat.ownerId.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "Access denied" });

    const messages = await Message.find({ flatId: flat._id })
      .populate("senderId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET messages from a specific sender (sender, owner, or admin)
exports.getUserMessages = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    const { senderId } = req.params;

    // Apenas o sender, owner do flat ou admin
    if (req.user.id !== senderId &&
        req.user.id !== flat.ownerId.toString() &&
        !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({
      flatId: flat._id,
      senderId: senderId,
    })
    .populate("senderId", "firstName lastName email")
    .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD new message
exports.addMessage = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }

    const message = await Message.create({
      content,
      flatId: flat._id,
      senderId: req.user.id,
    });

    res.status(201).json({ message: "Message sent successfully", data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// OPTIONAL: count unread messages for a user
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user.id,
      read: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
