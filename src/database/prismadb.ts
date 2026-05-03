import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client"
import { envs } from "../config/env"

// usando porta existente
const pool = new Pool({
    connectionString: envs.DATABASE_URL,
    ssl: true
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma, pool };