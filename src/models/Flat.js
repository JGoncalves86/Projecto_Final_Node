const mongoose = require("mongoose");

const FlatSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, "Cidade é obrigatória"],
      trim: true,
    },
    streetName: {
      type: String,
      required: [true, "Nome da rua é obrigatório"],
      trim: true,
    },
    streetNumber: {
      type: Number,
      required: [true, "Número da rua é obrigatório"],
      min: [1, "Número da rua deve ser maior que zero"],
    },
    areaSize: {
      type: Number,
      required: [true, "Área é obrigatória"],
      min: [1, "Área deve ser maior que zero (m²)"],
    },
    hasAC: {
      type: Boolean,
      default: false,
    },
    yearBuilt: {
      type: Number,
      min: [1800, "Ano de construção inválido"],
      max: [new Date().getFullYear(), "Ano de construção inválido"],
    },
    rentPrice: {
      type: Number,
      required: [true, "Preço do aluguel é obrigatório"],
      min: [0, "Preço do aluguel não pode ser negativo"],
    },
    dateAvailable: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= new Date(); // só datas futuras ou undefined
        },
        message: "A data de disponibilidade deve ser futura",
      },
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Proprietário é obrigatório"],
    },
    images: [
      {
        type: String,
        validate: {
          validator: function (url) {
            return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
          },
          message: "A imagem deve ser uma URL válida",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flat", FlatSchema);
