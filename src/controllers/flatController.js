const Flat = require("../models/Flat");

/* ===========================
   GET ALL FLATS
=========================== */
exports.getAllFlats = async (req, res) => {
  try {
    const flats = await Flat.find().populate(
      "ownerId",
      "firstName lastName email"
    );
    res.json(flats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   GET FLAT BY ID
=========================== */
exports.getFlatById = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id).populate(
      "ownerId",
      "firstName lastName email"
    );

    if (!flat) {
      return res.status(404).json({ message: "Flat not found" });
    }

    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   CREATE FLAT
=========================== */
exports.addFlat = async (req, res) => {
  try {
    // 🔐 Auth check
    if (!req.user) {
      return res.status(401).json({ message: "Utilizador não autenticado" });
    }

    const ownerId = req.user._id || req.user.id;

    // 🖼️ Imagens (APENAS via Multer)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
    }

    const flatData = {
      city: req.body.city,
      streetName: req.body.streetName,
      streetNumber: Number(req.body.streetNumber),
      areaSize: Number(req.body.areaSize),
      rentPrice: Number(req.body.rentPrice),
      ownerId,
      images,
    };

    const flat = await Flat.create(flatData);

    res.status(201).json({
      message: "Flat created successfully",
      flat,
    });
  } catch (error) {
    console.error("Erro ao criar flat:", error);
    res.status(500).json({
      message: "Erro ao criar flat",
      error: error.message,
    });
  }
};

/* ===========================
   UPDATE FLAT
=========================== */
exports.updateFlat = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilizador não autenticado" });
    }

    const flat = await Flat.findById(req.params.id);
    if (!flat) {
      return res.status(404).json({ message: "Flat not found" });
    }

    // 🔐 Permissões
    if (
      flat.ownerId.toString() !== (req.user._id || req.user.id) &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🔄 Campos
    if (req.body.city !== undefined) flat.city = req.body.city;
    if (req.body.streetName !== undefined) flat.streetName = req.body.streetName;
    if (req.body.streetNumber !== undefined)
      flat.streetNumber = Number(req.body.streetNumber);
    if (req.body.areaSize !== undefined)
      flat.areaSize = Number(req.body.areaSize);
    if (req.body.rentPrice !== undefined)
      flat.rentPrice = Number(req.body.rentPrice);

    // 🖼️ Imagens existentes
    if (req.body.existingImages) {
      flat.images = JSON.parse(req.body.existingImages);
    }

    // ➕ Novas imagens
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
      flat.images = [...flat.images, ...newImages];
    }

    await flat.save();

    res.json({ message: "Flat updated successfully", flat });
  } catch (error) {
    console.error("Erro ao atualizar flat:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   DELETE FLAT
=========================== */
exports.deleteFlat = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilizador não autenticado" });
    }

    const flat = await Flat.findById(req.params.id);
    if (!flat) {
      return res.status(404).json({ message: "Flat not found" });
    }

    if (
      flat.ownerId.toString() !== (req.user._id || req.user.id) &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await flat.deleteOne();
    res.json({ message: "Flat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
