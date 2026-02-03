const userService = require('../services/user.service');
const Joi = require('joi');
const User = require("../models/User");
const { updateUserSchema } = require("../validations/user.validation");


// ==========================
// LOGIN SCHEMA
// ==========================
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ==========================
// REGISTER
// ==========================
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, birthDate } = req.body;

    if (!email || !password || !firstName || !lastName || !birthDate) {
      return res.status(400).json({
        status: 'fail',
        message: 'Todos os campos são obrigatórios',
      });
    }

    const result = await userService.registerUser(req.body);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// ==========================
// LOGIN
// ==========================
const login = async (req, res) => {
  try {
    console.log('REQ.BODY:', req.body);

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }

    const { email, password } = req.body;

    const result = await userService.loginUser(email, password);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(401).json({ status: 'fail', message: err.message });
  }
};

// ==========================
// GET PROFILE
// ==========================
const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};


// ==========================
// UPDATE PROFILE
// ==========================
const updateProfile = async (req, res) => {
  try {
    // validar body
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }

    // update seguro
    const updatedUser = await userService.updateUser(req.user.id, req.body);

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// GET MY FAVOURITE FLATS
const getMyFavourites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favouriteFlats");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      favourites: user.favouriteFlats,
});

  } catch (err) {
    next(err);
  }
};

const addFavouriteFlat = async (req, res) => {
  try {
    console.log("✅ addFavouriteFlat chamado");
    console.log("User ID:", req.user?.id);
    console.log("Flat ID:", req.params.flatId);
    const user = await userService.addFavoriteFlat(
      req.user.id,
      req.params.flatId
    );

    res.status(200).json({
      status: "success",
      message: "Flat added to favourites",
      user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const removeFavouriteFlat = async (req, res) => {
  try {
    console.log("✅ removeFavouriteFlat chamado");
    console.log("User ID:", req.user?.id);
    console.log("Flat ID:", req.params.flatId);
    const user = await userService.removeFavoriteFlat(
      req.user.id,
      req.params.flatId
    );

    res.status(200).json({
      status: "success",
      message: "Flat removed from favourites",
      user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getMyFavourites,
  addFavouriteFlat,
  removeFavouriteFlat
};
