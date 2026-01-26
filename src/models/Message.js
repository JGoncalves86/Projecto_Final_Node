const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "O conteúdo da mensagem é obrigatório"],
      trim: true,
      validate: {
        validator: (value) => value.length > 0,
        message: "O conteúdo da mensagem não pode estar vazio",
      },
    },
    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: [true, "O ID do flat é obrigatório"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "O ID do remetente é obrigatório"],
    },
  },
  { timestamps: true } // createdAt / updatedAt automáticos
);

module.exports = mongoose.model("Message", MessageSchema);
