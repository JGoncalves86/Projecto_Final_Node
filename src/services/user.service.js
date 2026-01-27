const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');

// ==========================
// REGISTER USER
// ==========================
const registerUser = async (data) => {
  const { email, password, firstName, lastName, birthDate } = data;

  // Checa email duplicado
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already in use');

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    birthDate,
    isAdmin: false, // por padrão
  });

  // Gerar token JWT
  const token = generateToken({ id: user._id.toString(), isAdmin: user.isAdmin });

  return { user, token };
};

// ==========================
// LOGIN USER
// ==========================
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  // Gerar token JWT
  const token = generateToken({ id: user._id.toString(), isAdmin: user.isAdmin });

  return { user, token };
};

// ==========================
// UPDATE USER
// ==========================
const updateUser = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Se senha for atualizada, hash
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  Object.assign(user, data);
  await user.save();

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
};
