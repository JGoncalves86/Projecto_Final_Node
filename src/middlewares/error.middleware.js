const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Erro de validação Joi
  if (err.isJoi) {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Erros do Mongoose (ex: duplicidade, ObjectId inválido)
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      status: 'fail',
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Erro de upload (Multer)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'fail',
      message: 'File too large. Maximum allowed size is 5MB.',
    });
  }

  if (err.message && err.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Custom errors lançados no service
  if (err.message) {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Erro inesperado
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

module.exports = errorMiddleware;
