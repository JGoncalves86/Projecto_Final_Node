const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date },
    isAdmin: { type: Boolean, default: false },
    favouriteFlats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flat" }]
  },
  { timestamps: true } // createdAt / updatedAt automáticos
);

module.exports = mongoose.model("User", UserSchema);
