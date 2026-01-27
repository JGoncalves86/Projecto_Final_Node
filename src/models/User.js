const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // nunca vem nas queries por defeito
    },

    firstName: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
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
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
      },
    ],
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
