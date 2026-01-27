const multer = require("multer");
const path = require("path");

// Salvar arquivos em /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Aceita apenas jpg, png, jpeg
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only jpg, jpeg, png files are allowed"));
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por segurança
});

module.exports = upload;
