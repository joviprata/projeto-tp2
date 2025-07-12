const express = require('express');

const router = express.Router();
const productListsController = require('../controllers/product_lists_controller');

// rota para gerenciar listas de produtos

/**
 * @swagger
 * tags:
 *   name: ProductLists
 *   description: API para gerenciar listas de produtos
 */

/**
 * @swagger
 * /product-lists:
 *   post:
 *     summary: Cria uma nova lista de compras
 *     tags: [ProductLists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID do usuário proprietário da lista
 *               listName:
 *                 type: string
 *                 description: Nome da nova lista de produtos
 *             example:
 *               userId: 1
 *               listName: "Compras do Mês"
 *     responses:
 *       201:
 *         description: Lista de compras criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductList'
 *       400:
 *         description: ID do usuário e nome da lista são obrigatórios, ou nome da lista não pode ser vazio.
 *       403:
 *         description: Apenas usuários clientes podem criar listas de compras.
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', productListsController.createProductList);

/**
 * @swagger
 * /product-lists/user/{userId}:
 *   get:
 *     summary: Retorna todas as listas de produtos de um usuário
 *     tags: [ProductLists]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Listas de produtos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductList'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/user/:userId', productListsController.getListsByUserId);

/**
 * @swagger
 * /product-lists/{listId}/items:
 *   post:
 *     summary: Adiciona um produto a uma lista de compras ou atualiza sua quantidade se já existir
 *     tags: [ProductLists]
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID do produto a ser adicionado
 *               quantity:
 *                 type: integer
 *                 description: Quantidade do produto (padrão 1)
 *             example:
 *               productId: 1
 *               quantity: 3
 *     responses:
 *       201:
 *         description: Produto adicionado na lista com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListItem'
 *       404:
 *         description: Produto ou Lista de compras não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/:listId/items', productListsController.addProductToList);

/**
 * @swagger
 * /product-lists/{listId}/items/{productId}:
 *   put:
 *     summary: Atualiza um produto em uma lista de compras
 *     tags: [ProductLists]
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da lista
 *       - in: path
 *         name: productId
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
 *               quantity:
 *                 type: integer
 *                 description: Nova quantidade do produto (opcional)
 *               isTaken:
 *                 type: boolean
 *                 description: Novo status de "marcado como pego" (opcional)
 *             example:
 *               quantity: 5
 *               isTaken: true
 *     responses:
 *       200:
 *         description: Produto atualizado na lista com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListItem'
 *       400:
 *         description: Dados de atualização inválidos.
 *       404:
 *         description: Item da lista não foi encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put('/:listId/items/:productId', productListsController.updateProductFromList);

/**
 * @swagger
 * /product-lists/{listId}/items/{productId}:
 *   delete:
 *     summary: Deleta um produto de uma lista de compras
 *     tags: [ProductLists]
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da lista
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto deletado da lista com sucesso (No Content).
 *       404:
 *         description: Item da lista não foi encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/:listId/items/:productId', productListsController.deleteProductFromList);

/**
 * @swagger
 * /product-lists/{listId}:
 *   delete:
 *     summary: Deleta uma lista de compras
 *     tags: [ProductLists]
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da lista
 *     responses:
 *       204:
 *         description: Lista de compras deletada com sucesso (No Content).
 *       404:
 *         description: Lista de compras não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/:listId', productListsController.deleteList);

module.exports = router;
