// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "未登录" }, { status: 401 });

    const decoded: any = verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) return NextResponse.json({ message: "用户不存在" }, { status: 404 });

    return NextResponse.json({ name: user.name, email: user.email, role: user.role });
  } catch (e) {
    return NextResponse.json({ message: "鉴权失败" }, { status: 401 });
  }
}
