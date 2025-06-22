const express = require("express");
const router = express.Router(); // importa o Router do Express
const product_controller = require("../controllers/product_controller"); // importa o controller de produtos

router.post("/", product_controller.registerProduct); // Rota para registrar um produto

router.get("/", product_controller.getAllProducts); // Rota para obter todos os produtos

router.get("/:id", product_controller.getProductById); // Rota para obter um produto por ID

router.put("/:id", product_controller.updateProduct); // Rota para atualizar um produto por ID

router.delete("/:id", product_controller.deleteProduct); // Rota para deletar um produto por ID

module.exports = router; // exporta o router para ser usado no servidor principal

