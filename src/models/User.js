const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true
    },
    birthDate: {
      type: Date,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    favouriteFlats: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Flat" }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);