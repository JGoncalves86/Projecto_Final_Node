const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    streetName: { type: String, required: true, trim: true },
    streetNumber: { type: Number, required: true, trim: true },
    areaSize: { type: Number, required: true, min: 1 },
    hasAC: { type: Boolean, required: true, default: false },
    yearBuilt: { type: Number, required: true, min: 1800, max: new Date().getFullYear() },
    rentPrice: { type: Number, required: true, min: 0 },
    dateAvailable: { type: Date, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);
module.exports = mongoose.model('Flat', flatSchema);