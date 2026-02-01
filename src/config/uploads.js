const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

// garante que a pasta existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log("Pasta 'uploads/' criada com sucesso!");
}

module.exports = { UPLOADS_DIR };
