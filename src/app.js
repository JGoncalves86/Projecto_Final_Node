const express = require("express");
const cors = require("cors");

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
app.use("/flats", messageRoutes);

app.get("/", (req, res) => {
  res.send("FlatFinder API is running 🚀");
});

module.exports = app;
