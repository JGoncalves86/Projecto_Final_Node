const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");

// ======================
// REGISTER
// ======================
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, birthDate } = req.body;

    // Verifica se o utilizador já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "error 400 : User already exists" });
    }

    // Hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar utilizador
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate,
      favouriteFlats: [],
      isAdmin: false
    });

    res.status(201).json({ message: "User registered successfully", user });
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "error 401 : Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "error 401 : Invalid credentials" });
    }

    // Gera token JWT
    const token = generateToken({
      id: user._id,
      isAdmin: user.isAdmin
    });

    res.json({ message: "Login successful", token, user });
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
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("favouriteFlats");

    if (!user) return res.status(404).json({ message: "error 404 : User not found" });

    res.json(user);
  } catch (error) {
    console.error("GetProfile error:", error);
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

    // Apenas o dono ou admin podem editar
    if (req.user.id !== user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "error 403 : Access denied" });
    }

    const { firstName, lastName, birthDate, isAdmin } = req.body;

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.birthDate = birthDate || user.birthDate;

    if (typeof isAdmin !== "undefined") {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "error 403 : Only admin can change isAdmin" });
      }
      user.isAdmin = isAdmin;
    }

    await user.save();
    res.json({ message: "User updated", user });
  } catch (error) {
    console.error("UpdateUser error:", error);
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
    console.error("DeleteUser error:", error);
    res.status(500).json({ message: "error 500 : " + error.message });
  }
};

// ======================
// TOGGLE FAVORITE
// ======================
exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "error 404 : User not found" });

    const flatId = req.params.flatId;
    const index = user.favouriteFlats.findIndex(f => f.toString() === flatId);

    if (index === -1) {
      user.favouriteFlats.push(flatId);
    } else {
      user.favouriteFlats.splice(index, 1);
    }

    await user.save();
    res.json(user.favouriteFlats);
  } catch (error) {
    console.error("ToggleFavorite error:", error);
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
    console.error("GetUserFavorites error:", error);
    res.status(500).json({ message: "error 500 : " + error.message });
  }
};
