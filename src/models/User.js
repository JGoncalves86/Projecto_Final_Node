const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthDate: Date,
  isAdmin: { type: Boolean, default: false },
  favouriteFlats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flat" }]
});

module.exports = mongoose.model("User", userSchema);
