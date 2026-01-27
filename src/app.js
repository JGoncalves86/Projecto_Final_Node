const express = require("express");
const cors = require("cors");
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Pasta uploads criada com sucesso!");
}

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://o-teu-frontend.onrender.com"
  ],
}));

app.use(express.json());

const userRoutes = require("./routes/user.routes");
const flatRoutes = require("./routes/flat.routes");
const messageRoutes = require("./routes/message.routes");

app.use("/users", userRoutes);
app.use("/flats", flatRoutes);
app.use("/messages", messageRoutes);
app.use('/uploads', express.static(uploadDir));

app.get("/", (req, res) => {
  res.send("FlatFinder API is running 🚀");
});

module.exports = app;
