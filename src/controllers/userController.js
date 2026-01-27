const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");

// ======================
// REGISTER
// ======================
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, birthDate } = req.body;

    // Validar campos obrigatórios
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "error 400 : Missing required fields" });
    }

    // Verificar se já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "error 400 : User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate,
      favouriteFlats: []
    });

    res.status(201).json({ message: "User registered successfully", user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "error 500 : " + error.message });
  }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "error 400 : Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "error 401 : Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "error 401 : Invalid credentials" });
    }

    const token = generateToken({ id: user._id, isAdmin: user.isAdmin || false });

    res.json({ message: "Login successful", token, user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "error 500 : " + error.message });
  }
};

// ======================
// GET LOGGED USER PROFILE
// ======================
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "error 401 : Unauthorized" });

    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("favouriteFlats");

    if (!user) {
      return res.status(404).json({ message: "error 404 : User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "error 500 : " + error.message });
  }
};

// ======================
// UPDATE USER
// ======================
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "error 404 : User not found" });

    // Só o próprio user ou admin pode atualizar
    if (req.user.id !== user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "error 403 : Access denied" });
    }

    const { firstName, lastName, birthDate, isAdmin, password } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (birthDate) user.birthDate = birthDate;

    // Só admin pode alterar isAdmin
    if (typeof isAdmin !== "undefined") {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "error 403 : Only admin can change isAdmin" });
      }
      user.isAdmin = isAdmin;
    }

    // Atualizar password se fornecida
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "User updated", user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "error 500 : " + error.message });
  }
};

// ======================
// DELETE USER
// ======================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "error 404 : User not found" });

    if (req.user.id !== user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "error 403 : Access denied" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "error 500 : " + error.message });
  }
};

// ======================
// TOGGLE FAVORITE
// ======================
exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const flatId = req.params.flatId;

    if (!user) return res.status(404).json({ message: "error 404 : User not found" });

    const index = user.favouriteFlats.findIndex(f => f.toString() === flatId);
    if (index === -1) {
      user.favouriteFlats.push(flatId);
    } else {
      user.favouriteFlats.splice(index, 1);
    }

    await user.save();
    res.json(user.favouriteFlats);
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({ message: "error 500 : " + error.message });
  }
};

// ======================
// GET USER FAVORITES
// ======================
exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favouriteFlats");
    if (!user) return res.status(404).json({ message: "error 404 : User not found" });

    res.json(user.favouriteFlats);
  } catch (error) {
    console.error("Get user favorites error:", error);
    res.status(500).json({ message: "error 500 : " + error.message });
  }
};

// ======================
// GET ALL USERS (ADMIN)
// ======================
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "error 403 : Access denied" });

    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "error 500 : " + error.message });
  }
};

// ======================
// GET USER BY ID
// ======================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "error 404 : User not found" });
    res.json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "error 500 : " + error.message });
  }
};
