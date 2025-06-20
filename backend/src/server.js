const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth_route");
const app = express();
const authRoutes = require("./routes/auth_route");
const supermarketRoutes = require("./routes/supermarket_route");
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
app.use("/supermarkets", supermarketRoutes);

app.get("/", (req, res) => {
  res.send("Projeto Rodando");
});

app.use(authRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});

module.exports = app;
