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
  // Garantir que images seja array
  if (data.images && !Array.isArray(data.images)) {
    data.images = [data.images];
  }

  // Filtro de permissão
  const filter = isAdmin
    ? { _id: flatId }
    : { _id: flatId, ownerId: userId };

  const updatedFlat = await Flat.findOneAndUpdate(
    filter,
    { $set: data },
    { new: true } // retorna o documento atualizado
  );

  if (!updatedFlat) throw new Error("Flat not found or access denied");

  return updatedFlat;
};

// ---------------- DELETE FLAT ----------------
const deleteFlat = async (flatId, userId, isAdmin = false) => {
  const filter = isAdmin
    ? { _id: flatId }
    : { _id: flatId, ownerId: userId };

  const deleted = await Flat.findOneAndDelete(filter);

  if (!deleted) throw new Error("Flat not found or access denied");

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
