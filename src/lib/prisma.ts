// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// 避免开发环境下创建多个 PrismaClient 实例
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
