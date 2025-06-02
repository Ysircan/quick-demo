// src/lib/auth.ts
import { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const getUserFromToken = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = verify(token, JWT_SECRET) as { id: string };

    if (!decoded.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true }, // ✅ 注意 select 的字段
    });

    return user;
  } catch (error) {
    console.error("🔒 Token 验证失败:", error);
    return null;
  }
};
