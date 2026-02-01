const Flat = require("../models/Flat");
const User = require("../models/User");

// ---------------- CREATE FLAT ----------------
const createFlat = async (data) => {
  const { ownerId } = data;

  const owner = await User.findById(ownerId);
  if (!owner) throw new Error("Owner user not found");

  data.streetNumber = Number(data.streetNumber);
  data.areaSize = Number(data.areaSize);
  data.rentPrice = Number(data.rentPrice);
  if (data.yearBuilt) data.yearBuilt = Number(data.yearBuilt);

  if (!Array.isArray(data.images)) data.images = [];

  const flat = await Flat.create(data);
  return flat;
};

// ---------------- UPDATE FLAT ----------------
const updateFlat = async (flatId, userId, data, isAdmin = false) => {
  const flat = await Flat.findById(flatId);

  if (!flat) throw new Error("Flat not found");

  if (!isAdmin && flat.ownerId.toString() !== userId) {
    throw new Error("Access denied. Only owner can update this flat.");
  }

  Object.assign(flat, data);

  if (data.images && !Array.isArray(data.images)) {
    flat.images = [data.images];
  }

  await flat.save();
  return flat;
};

/// DELETE FLAT
const deleteFlat = async (flatId, userId, isAdmin = false) => {
  const flat = await Flat.findById(flatId);

  if (!flat) {
    throw new Error("Flat not found");
  }

  // Verificação de permissão
  if (!isAdmin && flat.ownerId.toString() !== userId.toString()) {
    throw new Error("Access denied. Only owner can delete this flat.");
  }

  // ✅ CORRETO NO MONGOOSE MODERNO
  await Flat.deleteOne({ _id: flatId });

  return { message: "Flat deleted successfully" };
};



// ---------------- GET FLAT BY ID ----------------
const getFlatById = async (flatId) => {
  const flat = await Flat.findById(flatId).populate(
    "ownerId",
    "firstName lastName email"
  );

  if (!flat) throw new Error("Flat not found");

  return flat;
};

// ---------------- LIST FLATS ----------------
const listFlats = async (
  filters = {},
  sort = { createdAt: -1 },
  limit = 20,
  skip = 0
) => {
  const query = {};

  if (filters.city) query.city = { $regex: filters.city, $options: "i" };
  if (filters.hasAC !== undefined) query.hasAC = filters.hasAC;
  if (filters.minPrice !== undefined)
    query.rentPrice = { ...query.rentPrice, $gte: filters.minPrice };
  if (filters.maxPrice !== undefined)
    query.rentPrice = { ...query.rentPrice, $lte: filters.maxPrice };
  if (filters.ownerId) query.ownerId = filters.ownerId;
  if (filters.dateAvailable)
    query.dateAvailable = { $gte: new Date(filters.dateAvailable) };

  return Flat.find(query)
    .populate("ownerId", "firstName lastName email")
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

module.exports = {
  createFlat,
  updateFlat,
  deleteFlat,
  getFlatById,
  listFlats,
};
