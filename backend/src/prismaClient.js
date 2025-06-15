import { PrismaClient } from "@prisma/client";
const prismaDatabase = new PrismaClient();
import 'dotenv/config.js'; // Importa as variáveis de ambiente que estão em .env

export default prismaDatabase;
