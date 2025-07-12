const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Comparação de Preços de Supermercados',
    version: '1.0.0',
    description:
      'Esta é a documentação da API para o projeto de comparação de preços de supermercados.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de desenvolvimento',
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'ID do usuário' },
          name: { type: 'string', description: 'Nome do usuário' },
          email: { type: 'string', format: 'email', description: 'Email do usuário' },
          password: { type: 'string', description: 'Senha do usuário' },
          role: {
            type: 'string',
            enum: ['USER', 'GERENTE'],
            description: 'Papel do usuário (USER ou GERENTE)',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação do usuário',
          },
        },
        example: {
          id: 1,
          name: 'João Silva',
          email: 'joao.silva@example.com',
          password: 'hashedpassword',
          role: 'USER',
          created_at: '2025-07-11T10:00:00.000Z',
        },
      },
      Supermarket: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'ID do supermercado' },
          managerId: { type: 'integer', description: 'ID do gerente associado ao supermercado' },
          name: { type: 'string', description: 'Nome do supermercado' },
          address: { type: 'string', description: 'Endereço do supermercado' },
          latitude: { type: 'number', format: 'float', description: 'Latitude do supermercado' },
          longitude: { type: 'number', format: 'float', description: 'Longitude do supermercado' },
        },
        example: {
          id: 1,
          managerId: 1,
          name: 'Supermercado Central',
          address: 'Rua Principal, 100',
          latitude: -23.5505,
          longitude: -46.6333,
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'ID do produto' },
          barCode: { type: 'string', description: 'Código de barras do produto' },
          name: { type: 'string', description: 'Nome do produto' },
          variableDescription: {
            type: 'string',
            nullable: true,
            description: 'Descrição variável do produto (ex: peso, volume)',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação do produto',
          },
        },
        example: {
          id: 1,
          barCode: '1234567890123',
          name: 'Arroz Branco',
          variableDescription: '5kg',
          created_at: '2025-07-11T10:00:00.000Z',
        },
      },
      PriceRecord: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'ID do registro de preço' },
          price: { type: 'number', format: 'float', description: 'Preço do produto' },
          data_registro: {
            type: 'string',
            format: 'date-time',
            description: 'Data do registro de preço',
          },
          available: { type: 'boolean', description: 'Indica se o produto está disponível' },
          verified: { type: 'boolean', description: 'Indica se o preço foi verificado' },
          productId: { type: 'integer', description: 'ID do produto' },
          supermarketId: {
            type: 'integer',
            description: 'ID do supermercado onde o preço foi registrado',
          },
          userId: { type: 'integer', description: 'ID do usuário que registrou o preço' },
        },
        example: {
          id: 1,
          price: 15.99,
          data_registro: '2025-07-11T10:00:00.000Z',
          available: true,
          verified: false,
          productId: 1,
          supermarketId: 1,
          userId: 1,
        },
      },
      ProductListItem: {
        type: 'object',
        properties: {
          listId: { type: 'integer', description: 'ID da lista de compras' },
          productId: { type: 'integer', description: 'ID do produto' },
          quantity: { type: 'integer', description: 'Quantidade do produto na lista' },
          isTaken: { type: 'boolean', description: 'Indica se o item já foi pego' },
        },
        example: {
          listId: 1,
          productId: 1,
          quantity: 2,
          isTaken: false,
        },
      },
      ProductList: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'ID da lista de compras' },
          listName: { type: 'string', description: 'Nome da lista de compras' },
          data_criacao: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação da lista',
          },
          userId: { type: 'integer', description: 'ID do usuário proprietário da lista' },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ProductListItem',
            },
            description: 'Itens na lista de compras',
          },
        },
        example: {
          id: 1,
          listName: 'Minha Lista de Supermercado',
          data_criacao: '2025-07-11T10:00:00.000Z',
          userId: 1,
          items: [
            {
              listId: 1,
              productId: 1,
              quantity: 2,
              isTaken: false,
            },
          ],
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
