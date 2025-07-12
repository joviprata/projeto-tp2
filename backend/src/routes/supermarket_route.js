const express = require('express');

const router = express.Router();
const supermarketController = require('../controllers/supermarket_controller');

/**
 * @swagger
 * tags:
 *   name: Supermarkets
 *   description: API para gerenciar supermercados
 */

/**
 * @swagger
 * /supermarkets/{id}:
 *   put:
 *     summary: Atualiza um supermercado (Nome e Endereço)
 *     tags: [Supermarkets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do supermercado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Novo nome do supermercado
 *               address:
 *                 type: string
 *                 description: Novo endereço do supermercado
 *             example:
 *               name: "Novo Supermercado Fantástico"
 *               address: "Nova Rua, 456"
 *     responses:
 *       200:
 *         description: Supermercado atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Supermercado atualizado com sucesso
 *       400:
 *         description: Requisição inválida (dados faltando ou excessivos)
 *       404:
 *         description: Supermercado não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', supermarketController.updateSupermarket);

/**
 * @swagger
 * /supermarkets/{id}:
 *   get:
 *     summary: Retorna um supermercado pelo ID
 *     tags: [Supermarkets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do supermercado
 *     responses:
 *       200:
 *         description: Supermercado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 address:
 *                   type: string
 *                 managerId:
 *                   type: integer
 *               example:
 *                 name: "Supermercado Exemplo"
 *                 email: "gerente@exemplo.com"
 *                 address: "Rua do Comércio, 123"
 *                 managerId: 1
 *       404:
 *         description: Supermercado não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', supermarketController.getSupermarketById);

/**
 * @swagger
 * /supermarkets:
 *   get:
 *     summary: Retorna todos os supermercados
 *     tags: [Supermarkets]
 *     responses:
 *       200:
 *         description: Lista de supermercados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supermarkets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supermarket'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', supermarketController.getAllSupermarkets);

/**
 * @swagger
 * /supermarkets/{id}:
 *   delete:
 *     summary: Deleta um supermercado e seu gerente associado
 *     tags: [Supermarkets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do supermercado a ser deletado
 *     responses:
 *       204:
 *         description: Supermercado deletado com sucesso (No Content)
 *       404:
 *         description: Supermercado não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', supermarketController.deleteSupermarket);

/**
 * @swagger
 * /supermarkets/manager/{id}:
 *   put:
 *     summary: Atualiza um supermercado e os dados do seu gerente
 *     tags: [Supermarkets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do gerente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Novo nome do supermercado e do gerente
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Novo email do gerente
 *               password:
 *                 type: string
 *                 description: Nova senha do gerente
 *               address:
 *                 type: string
 *                 description: Novo endereço do supermercado
 *             example:
 *               name: "Supermercado Gerenciado Atualizado"
 *               email: "novo.gerente@example.com"
 *               password: "novasenha123"
 *               address: "Nova Rua do Gerente, 789"
 *     responses:
 *       200:
 *         description: Supermercado e gerente atualizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Supermercado atualizado com sucesso
 *       400:
 *         description: Requisição inválida (dados faltando ou excessivos)
 *       404:
 *         description: Supermercado ou gerente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/manager/:id', supermarketController.putSupermarketByManagerId);

/**
 * @swagger
 * /supermarkets/cheapest/{listId}:
 *   get:
 *     summary: Retorna o(s) supermercado(s) mais barato(s) para uma lista de produtos
 *     tags: [Supermarkets]
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da lista de produtos
 *     responses:
 *       200:
 *         description: Lista de supermercados ordenada pelo preço total da lista
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supermarkets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CheapestSupermarketResult'
 *       404:
 *         description: Lista de produtos não encontrada ou vazia, ou nenhum supermercado com todos os produtos da lista.
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/cheapest/:listId', supermarketController.getCheapestSupermarket);

module.exports = router;
