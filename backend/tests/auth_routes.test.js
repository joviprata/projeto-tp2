const request = require("supertest");
const app = require("../src/server");
const prismaDatabase = require("../src/prismaClient");
beforeAll(async () => {
  // Lista de todas as tabelas a serem limpas
  const tableNames = [
    "users",
    "supermercado",
    "produtos",
    "registros_de_preco",
    "listas_de_compra",
    "itens_da_lista",
  ];

  console.log("Cleaning up the database...");
  for (const tableName of tableNames) {
    await prismaDatabase.$executeRawUnsafe(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`
    );
  }
});
afterAll(async () => {
  console.log("Disconnecting from the database...");
  await prismaDatabase.$disconnect();
});
