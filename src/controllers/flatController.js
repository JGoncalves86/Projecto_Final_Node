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
    if (!flat) return res.status(404).json({ message: "error 404 : Flat not found" });
    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD flat corrigido
exports.addFlat = async (req, res) => {
  try {
    // 1. Verificar se o utilizador existe (proteção extra)
    if (!req.user) {
      return res.status(401).json({ message: "Utilizador não autenticado" });
    }

    // 2. Preparar as imagens
    // Se vierem arquivos (Multer), usamos os caminhos. 
    // Se vierem URLs no body (JSON), usamos o que vem do front.
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    // 3. Criar o objeto com conversão explícita para evitar erros de Schema
    const flatData = {
      city: req.body.city,
      streetName: req.body.streetName,
      streetNumber: Number(req.body.streetNumber),
      areaSize: Number(req.body.areaSize),
      hasAC: req.body.hasAC === 'true' || req.body.hasAC === true,
      yearBuilt: req.body.yearBuilt ? Number(req.body.yearBuilt) : undefined,
      rentPrice: Number(req.body.rentPrice),
      dateAvailable: req.body.dateAvailable || undefined,
      ownerId: req.user._id || req.user.id, // Tenta ambos os formatos de ID
      images: images
    };

    const flat = await Flat.create(flatData);

    res.status(201).json({ message: "Flat added successfully", flat });
  } catch (error) {
    console.error("Erro no AddFlat:", error); // Isto vai aparecer nos logs do Render!
    res.status(500).json({ message: "Erro ao criar flat: " + error.message });
  }
};

// UPDATE flat
exports.updateFlat = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "error 404 : Flat not found" });

    // Somente o dono ou admin podem editar
    if (req.user.id !== flat.ownerId.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "error 403 : Access denied" });
    // Atualizar campos
    const { city, streetName, streetNumber, areaSize, rentPrice } = req.body;
    if (city !== undefined) flat.city = city;
    if (streetName !== undefined) flat.streetName = streetName;
    if (streetNumber !== undefined) flat.streetNumber = streetNumber;
    if (areaSize !== undefined) flat.areaSize = areaSize;
    if (rentPrice !== undefined) flat.rentPrice = rentPrice;

    // Se houver novos arquivos enviados, adiciona às imagens existentes
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      flat.images = [...flat.images, ...newImages];
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
    if (!flat) return res.status(404).json({ message: "error 404 : Flat not found" });

    if (req.user.id !== flat.ownerId.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "error 403 : Access denied" });

    await flat.deleteOne();
    res.json({ message: "Flat deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

