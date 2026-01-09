const express = require("express");
const app = express();

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
