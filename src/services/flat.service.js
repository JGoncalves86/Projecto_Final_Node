const Flat = require('../models/Flat');
const User = require('../models/User');

// ==========================
// CREATE FLAT
// ==========================
const createFlat = async (data) => {
  const { ownerId } = data;

  // Verifica se o owner existe
  const owner = await User.findById(ownerId);
  if (!owner) throw new Error('Owner user not found');

  // Garantir que números são Numbers
  data.streetNumber = Number(data.streetNumber);
  data.areaSize = Number(data.areaSize);
  data.rentPrice = Number(data.rentPrice);
  if (data.yearBuilt) data.yearBuilt = Number(data.yearBuilt);

  // Garantir que images é sempre array
  if (!Array.isArray(data.images)) data.images = [];

  const flat = await Flat.create(data);
  return flat;
};

// ==========================
// UPDATE FLAT
// ==========================
const updateFlat = async (flatId, userId, data, isAdmin = false) => {
  const flat = await Flat.findById(flatId);
  if (!flat) throw new Error('Flat not found');

  // Ownership check
  if (!isAdmin && flat.ownerId.toString() !== userId) {
    throw new Error('Access denied. Only owner can update this flat.');
  }

  // Atualiza apenas os campos recebidos
  Object.assign(flat, data);

  // Garantir images como array
  if (data.images && !Array.isArray(data.images)) {
    flat.images = [data.images];
  }

  await flat.save();
  return flat;
};

// ==========================
// DELETE FLAT
// ==========================
const deleteFlat = async (flatId, userId, isAdmin = false) => {
  const flat = await Flat.findById(flatId);
  if (!flat) throw new Error('Flat not found');

  if (!isAdmin && flat.ownerId.toString() !== userId) {
    throw new Error('Access denied. Only owner can delete this flat.');
  }

  await flat.remove();
  return { message: 'Flat deleted successfully' };
};

// ==========================
// GET FLAT BY ID
// ==========================
const getFlatById = async (flatId) => {
  const flat = await Flat.findById(flatId).populate('ownerId', 'firstName lastName email');
  if (!flat) throw new Error('Flat not found');
  return flat;
};

// ==========================
// LIST FLATS WITH FILTERS & SORTING
// ==========================
const listFlats = async (filters = {}, sort = { createdAt: -1 }, limit = 20, skip = 0) => {
  const query = {};

  // Filtros opcionais
  if (filters.city) query.city = { $regex: filters.city, $options: 'i' };
  if (filters.hasAC !== undefined) query.hasAC = filters.hasAC;
  if (filters.minPrice !== undefined) query.rentPrice = { ...query.rentPrice, $gte: filters.minPrice };
  if (filters.maxPrice !== undefined) query.rentPrice = { ...query.rentPrice, $lte: filters.maxPrice };
  if (filters.ownerId) query.ownerId = filters.ownerId;
  if (filters.dateAvailable) query.dateAvailable = { $gte: new Date(filters.dateAvailable) };

  const flats = await Flat.find(query)
    .populate('ownerId', 'firstName lastName email')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return flats;
};

module.exports = {
  createFlat,
  updateFlat,
  deleteFlat,
  getFlatById,
  listFlats,
};
