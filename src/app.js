const express = require("express");
const cors = require("cors");
const fs = require('fs');
const path = require('path');

// 1. GARANTIR PASTA DE UPLOADS (Crucial para o Render)
// Usamos path.resolve para evitar problemas de diretório em produção
const uploadDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("✅ Pasta uploads criada/verificada com sucesso!");
    } catch (err) {
        console.error("❌ Erro ao criar pasta uploads:", err);
    }
}

const app = express();

// 2. CONFIGURAÇÃO DE CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://o-teu-frontend.onrender.com" // Substitui pelo teu URL real do Render
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 3. MIDDLEWARES DE PARSING
// Adicionamos urlencoded para o Multer/FormData funcionar perfeitamente
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. SERVIR ARQUIVOS ESTÁTICOS
// Colocamos isto antes das rotas para acesso rápido às imagens
app.use('/uploads', express.static(uploadDir));

// 5. DEFINIÇÃO DAS ROTAS
const userRoutes = require("./routes/user.routes");
const flatRoutes = require("./routes/flat.routes");
const messageRoutes = require("./routes/message.routes");

app.use("/users", userRoutes);
app.use("/flats", flatRoutes);
app.use("/messages", messageRoutes);

// 6. ROTA DE TESTE & TRATAMENTO DE ERROS BÁSICO
app.get("/", (req, res) => {
  res.send("FlatFinder API is running 🚀");
});

// Middleware global de tratamento de erros para evitar Erro 500 sem explicação
app.use((err, req, res, next) => {
  console.error("🔥 Erro Global:", err.stack);
  res.status(500).json({ 
    message: "Erro interno no servidor", 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

module.exports = app;
