const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth_controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API para autenticação de usuários
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *             example:
 *               email: "usuario@example.com"
 *               password: "senha123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 userId:
 *                   type: integer
 *                 role:
 *                   type: string
 *       400:
 *         description: Requisição inválida (dados faltando ou excessivos)
 *       401:
 *         description: Email ou senha inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/register/manager:
 *   post:
 *     summary: Registra um novo gerente (e cria um supermercado associado)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do gerente e do supermercado
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do gerente
 *               password:
 *                 type: string
 *                 description: Senha do gerente
 *               address:
 *                 type: string
 *                 description: Endereço do supermercado
 *             example:
 *               name: "Gerente do Meu Super"
 *               email: "gerente@meusuper.com"
 *               password: "password123"
 *               address: "Av. Exemplo, 1000"
 *     responses:
 *       201:
 *         description: Gerente registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gerente registrado com sucesso
 *                 supermarketId:
 *                   type: integer
 *       400:
 *         description: Requisição inválida (dados faltando ou excessivos)
 *       409:
 *         description: Email já em uso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register/manager', authController.registerGerente);

/**
 * @swagger
 * /auth/register/user:
 *   post:
 *     summary: Registra um novo usuário cliente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *             example:
 *               name: "Novo Cliente"
 *               email: "cliente@example.com"
 *               password: "clientpass"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário registrado com sucesso
 *                 userId:
 *                   type: integer
 *       400:
 *         description: Requisição inválida (dados faltando ou excessivos)
 *       409:
 *         description: Email já em uso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register/user', authController.registerUser);

module.exports = router;
