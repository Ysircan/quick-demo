import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ 推荐用单例，避免重复连接
import { getUserFromToken } from "@/app/api/utils/auth";

export async function GET(req: NextRequest) {
  const tokenUser = await getUserFromToken(req); // ⚠️ await 因为 getUserFromToken 可能是 async 的

  if (!tokenUser) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: tokenUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  return NextResponse.json(user);
}
