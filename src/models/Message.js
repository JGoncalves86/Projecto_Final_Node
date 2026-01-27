const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    flatId: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);