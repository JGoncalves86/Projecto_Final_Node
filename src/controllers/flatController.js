const flatService = require('../services/flat.service');
const { createFlatSchema, updateFlatSchema } = require('../validations/flat.validation');

// CREATE FLAT
const createFlat = async (req, res, next) => {
  try {
    const images = req.files?.map(f => f.filename) || [];
    req.body.images = images;
    req.body.ownerId = req.user.id;

    const { error } = createFlatSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'fail', message: error.message });

    const flat = await flatService.createFlat(req.body);
    res.status(201).json({ status: 'success', message: 'Flat created', flat });
  } catch (err) {
    next(err);
  }
};

// UPDATE FLAT
const updateFlat = async (req, res, next) => {
  try {
    if (req.files?.length) req.body.images = req.files.map(f => f.filename);

    const { error } = updateFlatSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'fail', message: error.message });

    const updatedFlat = await flatService.updateFlat(req.params.id, req.user.id, req.body, req.user.isAdmin);
    res.status(200).json({ status: 'success', message: 'Flat updated', flat: updatedFlat });
  } catch (err) {
    next(err);
  }
};

// DELETE FLAT
const deleteFlat = async (req, res, next) => {
  try {
    const result = await flatService.deleteFlat(req.params.id, req.user.id, req.user.isAdmin);
    res.status(200).json({ status: 'success', ...result });
  } catch (err) {
    next(err);
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
