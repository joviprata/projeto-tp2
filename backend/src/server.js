const express = require("express");
const cors = require("cors"); // importa o cors para permitir requisições de outros domínios
const productRoutes = require("./routes/product_routes");
const app = express();

app.use(express.json()); //
app.use(cors()); // permite requisições de outros domínios
app.use("/products", productRoutes); // define a rota base para produtos

app.get("/", (req, res) => {
  res.send("Projeto Rodando");
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});


// Exporta o app e o prisma para uso em testes
module.exports = app;
