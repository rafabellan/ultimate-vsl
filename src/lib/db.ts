import { PrismaClient } from '@prisma/client';

// Garantir que apenas uma instância do Prisma seja criada
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db; 