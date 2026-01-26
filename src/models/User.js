const mongoose = require("mongoose");
const validator = require("validator"); // npm install validator

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Email inválido",
      },
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória"],
      minlength: [6, "Senha deve ter pelo menos 6 caracteres"],
      validate: {
        validator: (value) =>
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(value),
        message:
          "Senha deve conter letras, números e pelo menos um caractere especial",
      },
    },
    firstName: {
      type: String,
      required: [true, "Nome é obrigatório"],
      minlength: [2, "Nome deve ter pelo menos 2 caracteres"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Sobrenome é obrigatório"],
      minlength: [2, "Sobrenome deve ter pelo menos 2 caracteres"],
      trim: true,
    },
    birthDate: {
      type: Date,
      required: [true, "Data de nascimento é obrigatória"],
      validate: {
        validator: function (value) {
          if (!value) return false;
          const age = new Date().getFullYear() - value.getFullYear();
          return age >= 18 && age <= 120;
        },
        message: "Idade deve estar entre 18 e 120 anos",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    favouriteFlats: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Flat" }
    ],
  },
  { timestamps: true } // createdAt / updatedAt automáticos
);

module.exports = mongoose.model("User", UserSchema);
