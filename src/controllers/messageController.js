const Message = require("../models/Message");
const Flat = require("../models/Flat");

// GET all messages of a flat (only owner or admin)
exports.getAllMessages = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    if (req.user.id !== flat.ownerId.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "Access denied" });

    const messages = await Message.find({ flatId: flat._id })
      .populate("senderId", "firstName lastName email")
      .sort({ createdAt: -1 }); // mensagens mais recentes primeiro

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

    if (
      req.user.id !== req.params.senderId &&
      req.user.id !== flat.ownerId.toString() &&
      !req.user.isAdmin
    )
      return res.status(403).json({ message: "Access denied" });

    const messages = await Message.find({
      flatId: flat._id,
      senderId: req.params.senderId,
    }).sort({ createdAt: -1 });

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

    // ✅ Melhorias: valida conteúdo
    if (!req.body.content || req.body.content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }

    const message = await Message.create({
      content: req.body.content,
      flatId: flat._id,
      senderId: req.user.id,
    });

    res.status(201).json({ message: "Message sent", messageData: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
