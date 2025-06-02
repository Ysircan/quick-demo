// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const isDev = process.env.NODE_ENV !== 'production';

// 👇 这里允许开发环境下热更新时保留 prisma 实例，防止出现 "too many connections"
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// 👇 初始化 PrismaClient，可添加日志选项
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDev ? ['query', 'error', 'warn'] : ['error'], // 开发模式显示查询日志
  });

// 👇 仅在开发环境保留单例，避免多次创建实例
if (isDev) globalForPrisma.prisma = prisma;
