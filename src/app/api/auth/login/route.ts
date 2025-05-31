import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: "邮箱和密码不能为空" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        role: true,
        name: true, // ✅ 这里要选 name 才能返回
      },
    });

    if (!user) {
      return NextResponse.json({ message: "用户不存在或密码错误" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "用户不存在或密码错误" }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json({
      token,
      role: user.role,
      name: user.name, // ✅ 这里别漏逗号
    }, { status: 200 });

  } catch (error) {
    console.error("登录错误", error);
    return NextResponse.json({ message: "服务器错误" }, { status: 500 });
  }
}
