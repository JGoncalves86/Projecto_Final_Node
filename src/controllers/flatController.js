const flatService = require('../services/flat.service');
const { createFlatSchema, updateFlatSchema } = require('../validations/flat.validation');
const Flat = require("../models/Flat");
const cloudinary = require("../config/cloudinary");

// CREATE FLAT
const createFlat = async (req, res, next) => {
  try {
    const files = req.files || [];
    const imageUrls = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) throw error;
        return result;
      });
      // Como usamos memoryStorage, precisamos de upload_stream com buffer
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
        stream.end(file.buffer);
      });
      imageUrls.push(uploadResult.secure_url);
    }

    req.body.images = imageUrls;
    req.body.ownerId = req.user.id;

    const { error } = createFlatSchema.validate(req.body);
    if (error) return res.status(400).json({ status: "fail", message: error.message });

    const flat = await flatService.createFlat(req.body);
    res.status(201).json({ status: "success", message: "Flat created", flat });
  } catch (err) {
    next(err);
  }
};

// UPDATE FLAT
const updateFlat = async (req, res, next) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ status: "fail", message: "Flat not found" });

    const files = req.files || [];
    const newImageUrls = [];

    for (const file of files) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
        stream.end(file.buffer);
      });
      newImageUrls.push(uploadResult.secure_url);
    }

    // mantém as antigas + novas
    req.body.images = [...flat.images, ...newImageUrls];

    const { error } = updateFlatSchema.validate(req.body);
    if (error) return res.status(400).json({ status: "fail", message: error.message });

    const updatedFlat = await flatService.updateFlat(
      req.params.id,
      req.user.id,
      req.body,
      req.user.isAdmin
    );

    res.status(200).json({
      status: "success",
      message: "Flat updated successfully",
      flat: updatedFlat,
    });
  } catch (err) {
    next(err);
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
