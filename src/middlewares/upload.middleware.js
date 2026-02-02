const multer = require("multer");

// --------------------
// Armazenamento em memória
// --------------------
// Evita salvar arquivos no disco, perfeito para enviar direto para Cloudinary
const storage = multer.memoryStorage();

// --------------------
// Configuração do Multer
// --------------------
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por arquivo
  fileFilter: (req, file, cb) => {
    // Aceita apenas imagens
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Apenas arquivos de imagem são permitidos!"));
    }
    cb(null, true);
  },
});

// --------------------
// Middleware para múltiplos arquivos
// --------------------
// 'images' é o nome do campo do formData enviado do frontend
const uploadImages = upload.array("images", 10); // máximo 10 imagens por upload

module.exports = uploadImages;
