const express = require("express");
const router = express.Router(); // importa o Router do Express
const product_controller = require("../controllers/product_controller"); // importa o controller de produtos

router.post("/registerProduct", product_controller.registerProduct); // Rota para registrar um produto

module.exports = router;

