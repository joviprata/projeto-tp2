const express = require('express');

const router = express.Router();
const priceRecordsController = require('../controllers/price_records_controller');

/**
 * @swagger
 * tags:
 *   name: PriceRecords
 *   description: API para gerenciar registros de preços
 */

/**
 * @swagger
 * /price-records:
 *   post:
 *     summary: Cria um novo registro de preço
 *     tags: [PriceRecords]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Preço do produto
 *               supermarketId:
 *                 type: integer
 *                 description: ID do supermercado
 *               productId:
 *                 type: integer
 *                 description: ID do produto
 *               userId:
 *                 type: integer
 *                 description: ID do usuário que registra o preço
 *               available:
 *                 type: boolean
 *                 default: true
 *                 description: Indica se o produto está disponível (opcional, padrão true)
 *               verified:
 *                 type: boolean
 *                 default: false
 *                 description: Indica se o preço foi verificado (opcional, padrão false)
 *             required:
 *               - price
 *               - supermarketId
 *               - productId
 *               - userId
 *             example:
 *               price: 10.50
 *               supermarketId: 1
 *               productId: 1
 *               userId: 1
 *               available: true
 *               verified: false
 *     responses:
 *       201:
 *         description: Registro de preço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceRecord'
 *       400:
 *         description: Dados incompletos para criar o registro de preço.
 *       404:
 *         description: Produto, supermercado ou usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/', priceRecordsController.createPriceRecord);

/**
 * @swagger
 * /price-records:
 *   get:
 *     summary: Retorna todos os registros de preços
 *     tags: [PriceRecords]
 *     responses:
 *       200:
 *         description: Lista de registros de preços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PriceRecord'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', priceRecordsController.getAllPriceRecords);

/**
 * @swagger
 * /price-records/{id}:
 *   get:
 *     summary: Retorna um registro de preço pelo ID
 *     tags: [PriceRecords]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do registro de preço
 *     responses:
 *       200:
 *         description: Registro de preço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceRecord'
 *       404:
 *         description: Registro de preço não encontrado.
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', priceRecordsController.getPriceRecordById);

/**
 * @swagger
 * /price-records/{id}:
 *   put:
 *     summary: Atualiza um registro de preço
 *     tags: [PriceRecords]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do registro de preço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Novo preço (opcional)
 *               available:
 *                 type: boolean
 *                 description: Novo status de disponibilidade (opcional)
 *               verified:
 *                 type: boolean
 *                 description: Novo status de verificação (opcional)
 *             example:
 *               price: 11.25
 *               available: false
 *               verified: true
 *     responses:
 *       200:
 *         description: Registro de preço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceRecord'
 *       400:
 *         description: Nenhum dado para atualizar.
 *       404:
 *         description: Registro de preço não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put('/:id', priceRecordsController.updatePriceRecord);

/**
 * @swagger
 * /price-records/{id}:
 *   delete:
 *     summary: Deleta um registro de preço
 *     tags: [PriceRecords]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do registro de preço
 *     responses:
 *       204:
 *         description: Registro de preço deletado com sucesso (No Content).
 *       404:
 *         description: Registro de preço não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/:id', priceRecordsController.deletePriceRecord);

/**
 * @swagger
 * /price-records/supermarket/{supermarketId}:
 *   get:
 *     summary: Retorna registros de preços por ID do supermercado
 *     tags: [PriceRecords]
 *     parameters:
 *       - in: path
 *         name: supermarketId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do supermercado
 *     responses:
 *       200:
 *         description: Lista de registros de preços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PriceRecord'
 *       404:
 *         description: Supermercado não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/supermarket/:supermarketId', priceRecordsController.getPriceRecordsBySupermarketId);

/**
 * @swagger
 * /price-records/product/{productId}:
 *   get:
 *     summary: Retorna registros de preços por ID do produto
 *     tags: [PriceRecords]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Lista de registros de preços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PriceRecord'
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/product/:productId', priceRecordsController.getPriceRecordsByProductId);

module.exports = router;
