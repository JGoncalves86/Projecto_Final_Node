const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* -------------------- CORS -------------------- */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://o-teu-frontend.onrender.com",
    ],
    credentials: true,
  })
);

/* -------------------- BODY PARSERS -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- STATIC FILES (UPLOADS) -------------------- */
// MUITO IMPORTANTE para imagens dos flats
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* -------------------- ROUTES -------------------- */
const userRoutes = require("./routes/user.routes");
const flatRoutes = require("./routes/flat.routes");
const messageRoutes = require("./routes/message.routes");

app.use("/users", userRoutes);
app.use("/flats", flatRoutes);
app.use("/messages", messageRoutes);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.send("FlatFinder API is running 🚀");
});

/* -------------------- ERROR HANDLER (GLOBAL) -------------------- */
// Apanha erros do Multer e outros
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({
    message: err.message || "Erro interno do servidor",
  });
});

module.exports = app;
