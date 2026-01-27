const FlatSchema = new mongoose.Schema({
  city: { type: String, required: true },
  streetName: { type: String, required: true },
  streetNumber: Number,
  areaSize: Number,
  hasAC: Boolean,
  yearBuilt: Number,
  rentPrice: { type: Number, required: true },
  dateAvailable: Date,
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  images: [String] // Array de strings simples, sem validação de URL
}, { timestamps: true });