const flatService = require('../services/flat.service');
const { createFlatSchema, updateFlatSchema } = require('../validations/flat.validation');

const createFlat = async (req, res, next) => {
  try {
    // ✅ adicionar imagens upload
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.filename);
    }

    // ✅ validar com Joi
    const { error } = createFlatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // ✅ ownerId = user autenticado
    const data = {
      ...req.body,
      ownerId: req.user.id,
    };

    const flat = await flatService.createFlat(data);

    res.status(201).json({
      message: "Flat created successfully",
      flat,
    });
  } catch (err) {
    next(err);
  }
};


// ==========================
// UPDATE FLAT
// ==========================
const updateFlat = async (req, res, next) => {
  try {
    // adicionar novas imagens, se houver upload
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.path);
    }

    const { error } = updateFlatSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const flatId = req.params.id;
    const updatedFlat = await flatService.updateFlat(
      flatId,
      req.user.id,
      req.body,
      req.user.isAdmin
    );

    res.status(200).json({
      message: 'Flat updated successfully',
      flat: updatedFlat,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================
// DELETE FLAT
// ==========================
const deleteFlat = async (req, res, next) => {
  try {
    const flatId = req.params.id;
    const result = await flatService.deleteFlat(flatId, req.user.id, req.user.isAdmin);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// ==========================
// GET FLAT BY ID
// ==========================
const getFlatById = async (req, res, next) => {
  try {
    const flatId = req.params.id;
    const flat = await flatService.getFlatById(flatId);

    res.status(200).json(flat);
  } catch (err) {
    next(err);
  }
};

// ==========================
// LIST FLATS (FILTERS + SORT + PAGINATION)
// ==========================
const listFlats = async (req, res, next) => {
  try {
    const filters = {
      city: req.query.city,
      hasAC: req.query.hasAC !== undefined ? req.query.hasAC === 'true' : undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      ownerId: req.query.ownerId,
      dateAvailable: req.query.dateAvailable,
    };

    const sort = {};
    if (req.query.sortBy && req.query.order) {
      sort[req.query.sortBy] = req.query.order === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const skip = req.query.skip ? Number(req.query.skip) : 0;

    const flats = await flatService.listFlats(filters, sort, limit, skip);

    res.status(200).json(flats);
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
