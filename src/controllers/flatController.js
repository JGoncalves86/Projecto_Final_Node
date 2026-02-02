const flatService = require('../services/flat.service');
const { createFlatSchema, updateFlatSchema } = require('../validations/flat.validation');
const Flat = require("../models/Flat");

// CREATE FLAT
export const createFlat = async (req, res) => {
  try {
    const { city, streetName, streetNumber, areaSize, rentPrice, hasAC, yearBuilt, dateAvailable } = req.body;

    const images = req.files ? req.files.map(f => f.filename) : [];

    const flat = await Flat.create({
      city,
      streetName,
      streetNumber,
      areaSize,
      rentPrice,
      hasAC: hasAC === "true",
      yearBuilt,
      dateAvailable,
      images,
      ownerId: req.user._id,
    });

    return res.status(201).json({ status: "success", flat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao criar flat" });
  }
};

// UPDATE FLAT
export const updateFlat = async (req, res) => {
  try {
    const { id } = req.params;
    const flat = await Flat.findById(id);
    if (!flat) return res.status(404).json({ message: "Flat não encontrado" });

    // Campos do body
    const { city, streetName, streetNumber, areaSize, rentPrice, hasAC, yearBuilt, dateAvailable, existingImages } = req.body;

    flat.city = city || flat.city;
    flat.streetName = streetName || flat.streetName;
    flat.streetNumber = streetNumber ?? flat.streetNumber;
    flat.areaSize = areaSize ?? flat.areaSize;
    flat.rentPrice = rentPrice ?? flat.rentPrice;
    flat.hasAC = hasAC === "true" ? true : hasAC === "false" ? false : flat.hasAC;
    flat.yearBuilt = yearBuilt ?? flat.yearBuilt;
    flat.dateAvailable = dateAvailable || flat.dateAvailable;

    // Imagens
    const oldImages = Array.isArray(existingImages) ? existingImages : existingImages ? [existingImages] : [];
    const newImages = req.files ? req.files.map(f => f.filename) : [];
    flat.images = [...oldImages, ...newImages];

    await flat.save();

    return res.json({ status: "success", message: "Flat updated successfully", flat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao atualizar flat" });
  }
};


// DELETE FLAT
const deleteFlat = async (req, res) => {
  try {
    const result = await flatService.deleteFlat(
      req.params.id,
      req.user.id,
      req.user.isAdmin
    );

    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};




// GET FLAT BY ID
const getFlatById = async (req, res, next) => {
  try {
    const flat = await flatService.getFlatById(req.params.id);
    res.status(200).json({ status: 'success', flat });
  } catch (err) {
    next(err);
  }
};

// LIST FLATS
const listFlats = async (req, res, next) => {
  try {
    const filters = {
      city: req.query.city,
      hasAC: req.query.hasAC !== undefined ? req.query.hasAC === "true" : undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      ownerId: req.query.ownerId,
      dateAvailable: req.query.dateAvailable,
    };

    const sort = req.query.sortBy && req.query.order 
      ? { [req.query.sortBy]: req.query.order === "asc" ? 1 : -1 } 
      : { createdAt: -1 };

    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const skip = req.query.skip ? Number(req.query.skip) : 0;

    const flats = await flatService.listFlats(filters, sort, limit, skip);
    res.status(200).json({ status: 'success', flats });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFlat,
  updateFlat,
  deleteFlat,
  getFlatById,
  listFlats,
};
