const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pasta de uploads
const uploadDir = path.join(__dirname, '../uploads');

// Garante que a pasta existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Pasta 'uploads/' criada com sucesso!");
}

// Configuração de storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// Filtro de tipo de arquivo
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

// Middleware final
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// Wrapper para garantir que req.files seja sempre array
const uploadFiles = (fieldName) => (req, res, next) => {
  const uploader = upload.array(fieldName);
  uploader(req, res, (err) => {
    if (err) return next(err);
    if (!req.files) req.files = []; // garante array vazio
    next();
  });
};

module.exports = uploadFiles;
