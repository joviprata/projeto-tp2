
const { PrismaClient } = require("@prisma/client");
const prismaDatabase = new PrismaClient();

module.exports = prismaDatabase;
