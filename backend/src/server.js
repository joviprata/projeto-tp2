const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth_route");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Projeto Rodando");
});

app.use(authRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});

module.exports = app;
