const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const { generateToken } = require('../config/jwt');

// ==========================
// REGISTER USER
// ==========================
const registerUser = async (data) => {
  const { email, password, firstName, lastName, birthDate } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    birthDate,
    isAdmin: false,
  });

  const token = generateToken({ id: user._id.toString(), isAdmin: user.isAdmin });

  return { user, token };
};

// ==========================
// LOGIN USER
// ==========================
const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email e password são obrigatórios');
  }

  // Buscar usuário e incluir password
  const user = await User.findOne({ email }).select('+password');

  console.log('Senha fornecida:', password);
  console.log('Senha no DB:', user ? user.password : undefined);

  if (!user) {
    console.error(`Login failed: usuário não encontrado (${email})`);
    throw new Error('Email ou password inválido');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.error(`Login failed: senha incorreta (${email})`);
    throw new Error('Email ou password inválido');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não definido no ambiente');
  }

  const token = generateToken({ id: user._id.toString(), isAdmin: user.isAdmin });

  return { user, token };
};



// ==========================
// GET USER BY ID
// ==========================
const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

// ==========================
// LIST ALL USERS (ADMIN)
// ==========================
const listAllUsers = async () => {
  const users = await User.find().select('-password');
  return users;
};

// ==========================
// DELETE USER (ADMIN)
// ==========================
const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  await user.remove();
  return true;
};

// ==========================
// UPDATE USER
// ==========================
const updateUser = async (userId, data) => {
  const allowedFields = ["firstName", "lastName", "birthDate"];

  const filteredData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      filteredData[field] = data[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: filteredData },
    { new: true }
  ).select("-password");

  if (!updatedUser) throw new Error("User not found");

  return updatedUser;
};



module.exports = {
  registerUser,
  loginUser,
  getUserById,
  listAllUsers,
  deleteUser,
  updateUser,
};
