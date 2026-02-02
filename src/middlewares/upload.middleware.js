const multer = require("multer");

// ============================
// Armazenamento em memória
// ============================
// Evita salvar arquivos no disco, ideal para enviar direto ao Cloudinary
const storage = multer.memoryStorage();

// ============================
// Configuração do Multer
// ============================
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite: 5MB por arquivo
  fileFilter: (req, file, cb) => {
    // Aceita apenas imagens
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Apenas arquivos de imagem são permitidos!"));
    }
    cb(null, true);
  },
});

// ============================
// Middleware para múltiplos arquivos
// ============================
// 'images' é o nome do campo do formData enviado do frontend
// Máximo de 10 imagens por upload
const uploadImages = upload.array("images", 10);

// ============================
// Export
// ============================
module.exports = uploadImages;
