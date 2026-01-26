const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const Flat = require("../models/Flat");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, birthDate } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate,
      favouriteFlats: [] // inicializa array de favoritos
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({
      id: user._id,
      isAdmin: user.isAdmin
    });

    res.json({ message: "Login successful", token, user }); // retorna user junto com token
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE user (Admin / Owner)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.id !== user._id.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "Access denied" });

    const { firstName, lastName, birthDate, isAdmin } = req.body;

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.birthDate = birthDate || user.birthDate;

    if (typeof isAdmin !== "undefined") {
      if (!req.user.isAdmin) return res.status(403).json({ message: "Only admin can change isAdmin" });
      user.isAdmin = isAdmin;
    }

    await user.save();
    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE user (Admin / Owner)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.id !== user._id.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "Access denied" });

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE FAVORITE (add/remove)
exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const flatId = req.params.flatId;

    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favouriteFlats.findIndex(f => f.toString() === flatId);


    if (index === -1) {
      user.favouriteFlats.push(flatId);
    } else {
      user.favouriteFlats.splice(index, 1);
    }

    await user.save();
    res.json(user.favouriteFlats); // retorna array atualizado
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER FAVORITES
exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favouriteFlats"); 
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favouriteFlats); // retorna array de flats favoritos
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


