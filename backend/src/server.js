const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Projeto Rodando");
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
