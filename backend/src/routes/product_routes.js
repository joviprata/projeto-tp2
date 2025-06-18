const express = require("express");
const router = express.Router(); // importa o Router do Express
const produto_Controller = require("../controllers/product_controller.js"); // importa o controller de produtos

router.post("/registerProduct", produto_Controller.registerProduct); // Rota para registrar um produto

module.exports = router;

