const express = require("express");
const cors = require("cors"); // importa o cors para permitir requisições de outros domínios
const ProductRoutes = require("./routes/product.routes.js");
const app = express();

app.use(express.json()); //
app.use(cors()); // permite requisições de outros domínios

app.get("/", (req, res) => {
  res.send("Projeto Rodando");
});

// Importa as rotas de produtos
app.use(ProductRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});


// Exporta o app e o prisma para uso em testes
module.exports = app;
