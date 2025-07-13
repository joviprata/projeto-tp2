const express = require('express');

const router = express.Router(); // importa o Router do Express
const productController = require('../controllers/product_controller'); // importa o controller de produtos

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API para gerenciar produtos
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Registra um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do produto
 *               barCode:
 *                 type: string
 *                 description: Código de barras do produto
 *               variableDescription:
 *                 type: string
 *                 nullable: true
 *                 description: Descrição variável do produto (e.g., "500g", "1L")
 *             example:
 *               name: "Leite Integral"
 *               barCode: "9876543210987"
 *               variableDescription: "1 Litro"
 *     responses:
 *       200: # O controller retorna 200 para sucesso, não 201
 *         description: Produto registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados do produto incompletos ou produto com nome/código de barras já existe.
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', productController.registerProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retorna todos os produtos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /products/with-price-records:
 *   get:
 *     summary: Retorna todos os produtos com seus registros de preço agrupados por supermercado
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos com registros de preço
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   barCode:
 *                     type: string
 *                   variableDescription:
 *                     type: string
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   pricesBySupermarket:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         supermarket:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             address:
 *                               type: string
 *                               nullable: true
 *                         priceRecords:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               price:
 *                                 type: number
 *                               recordDate:
 *                                 type: string
 *                                 format: date-time
 *                               available:
 *                                 type: boolean
 *                               verified:
 *                                 type: boolean
 *                               user:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                   name:
 *                                     type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/with-price-records', productController.getAllProductsWithPriceRecords);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Novo nome do produto
 *               barCode:
 *                 type: string
 *                 description: Novo código de barras do produto
 *               variableDescription:
 *                 type: string
 *                 nullable: true
 *                 description: Nova descrição variável do produto
 *             example:
 *               name: "Leite Desnatado"
 *               barCode: "9876543210988"
 *               variableDescription: "1 Litro Light"
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados do produto inválidos/incompletos ou produto com nome/código de barras já existente.
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto excluído com sucesso
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', productController.deleteProduct);

module.exports = router;
