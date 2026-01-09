const Flat = require("../models/Flat");

// GET all flats
exports.getAllFlats = async (req, res) => {
  try {
    const flats = await Flat.find().populate("ownerId", "firstName lastName email");
    res.json(flats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET flat by id
exports.getFlatById = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id).populate("ownerId", "firstName lastName email");
    if (!flat) return res.status(404).json({ message: "Flat not found" });
    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD flat
exports.addFlat = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => file.filename) : [];
    const flat = await Flat.create({ ...req.body, ownerId: req.user.id, images });
    res.status(201).json({ message: "Flat added", flat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE flat
exports.updateFlat = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    if (req.user.id !== flat.ownerId.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "Access denied" });

    Object.assign(flat, req.body);

    // Atualizar imagens se houver upload
    if (req.files) {
      flat.images = req.files.map(file => file.filename);
    }

    await flat.save();
    res.json({ message: "Flat updated", flat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE flat
exports.deleteFlat = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    if (req.user.id !== flat.ownerId.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "Access denied" });

    await flat.deleteOne();
    res.json({ message: "Flat deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

