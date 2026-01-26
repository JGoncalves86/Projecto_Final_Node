const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const Flat = require("../models/Flat");

// ======================
// REGISTER
// ======================
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, birthDate } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "error 400 : User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate,
      favouriteFlats: []
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "error 401 : Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "error 401 : Invalid credentials" });

    const token = generateToken({
      id: user._id,
      isAdmin: user.isAdmin
    });

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// GET LOGGED USER PROFILE ✅ NOVO
// ======================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("favouriteFlats");

    if (!user)
      return res.status(404).json({ message: "error 404 : User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// GET ALL USERS (ADMIN)
// ======================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// GET USER BY ID
// ======================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "error 404 : User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// UPDATE USER
// ======================
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "error 404 : User not found" });

    if (req.user.id !== user._id.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "error 403 : Access denied" });

    const { firstName, lastName, birthDate, isAdmin } = req.body;

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.birthDate = birthDate || user.birthDate;

    if (typeof isAdmin !== "undefined") {
      if (!req.user.isAdmin)
        return res
          .status(403)
          .json({ message: "error 403 : Only admin can change isAdmin" });
      user.isAdmin = isAdmin;
    }

    await user.save();
    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// DELETE USER
// ======================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "error 404 : User not found" });

    if (req.user.id !== user._id.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "error 403 : Access denied" });

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// TOGGLE FAVORITE
// ======================
exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const flatId = req.params.flatId;

    if (!user)
      return res.status(404).json({ message: "error 404 : User not found" });

    const index = user.favouriteFlats.findIndex(
      (f) => f.toString() === flatId
    );

    if (index === -1) {
      user.favouriteFlats.push(flatId);
    } else {
      user.favouriteFlats.splice(index, 1);
    }

    await user.save();
    res.json(user.favouriteFlats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// GET USER FAVORITES
// ======================
exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favouriteFlats");
    if (!user)
      return res.status(404).json({ message: "error 404 : User not found" });

    res.json(user.favouriteFlats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
