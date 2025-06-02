import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ 用封装好的单例
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginRequest, LoginResponse } from "@/lib/api/auth";

// ✅ JWT 密钥校验
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("❌ JWT_SECRET 未在环境中配置");

// ✅ 登录接口
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginRequest;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    let points: number | undefined;
    if (user.role === "STUDENT") {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
      });
      points = student?.points;
    }

    const result: LoginResponse = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl ?? undefined,
        points,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("登录异常:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
