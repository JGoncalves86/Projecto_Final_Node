const mongoose = require("mongoose");

const FlatSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    streetName: { type: String, required: true },
    streetNumber: { type: Number, required: true },
    areaSize: { type: Number, required: true },
    hasAC: { type: Boolean, default: false },
    yearBuilt: { type: Number },
    rentPrice: { type: Number, required: true },
    dateAvailable: { type: Date },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    images: {
        type: [String],
        default: []} // <- NOVO campo para armazenar caminhos das imagens
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flat", FlatSchema);