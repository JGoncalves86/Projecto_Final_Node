const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* =========================
   CORS — TEM DE VIR PRIMEIRO
========================= */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://o-teu-frontend.onrender.com"
  ],
  credentials: true,
}));

// 👉 responder explicitamente aos OPTIONS
app.options("*", cors());

/* =========================
   MIDDLEWARES
========================= */

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROTAS
========================= */

const userRoutes = require("./routes/user.routes");
const flatRoutes = require("./routes/flat.routes");
const messageRoutes = require("./routes/message.routes");

app.use("/users", userRoutes);
app.use("/flats", flatRoutes);
app.use("/flats", messageRoutes);

/* =========================
   TESTE
========================= */

app.get("/", (req, res) => {
  res.send("FlatFinder API is running 🚀");
});

module.exports = app;
