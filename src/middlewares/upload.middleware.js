// middlewares/upload.middleware.js
const multer = require("multer");
const path = require("path");

// Pasta de destino
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Tipo de ficheiro não permitido"));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
