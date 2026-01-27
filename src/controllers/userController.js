const userService = require('../services/user.service');
const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require('../validations/user.validation');

// ==========================
// REGISTER
// ==========================
const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await userService.registerUser(req.body);

    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================
// LOGIN
// ==========================
const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================
// UPDATE PROFILE
// ==========================
const updateProfile = async (req, res, next) => {
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedUser = await userService.updateUser(
      req.user.id,
      req.body
    );

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================
// FAVORITES
// ==========================
const addFavorite = async (req, res, next) => {
  try {
    const { flatId } = req.params;

    const user = await userService.addFavoriteFlat(
      req.user.id,
      flatId
    );

    res.status(200).json({
      message: 'Flat added to favorites',
      user,
    });
  } catch (err) {
    next(err);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const { flatId } = req.params;

    const user = await userService.removeFavoriteFlat(
      req.user.id,
      flatId
    );

    res.status(200).json({
      message: 'Flat removed from favorites',
      user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  updateProfile,
  addFavorite,
  removeFavorite,
};
