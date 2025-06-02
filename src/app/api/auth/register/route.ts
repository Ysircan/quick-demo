import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, role, name } = body;

  if (!email || !password || !role || !name) {
    return NextResponse.json({ message: "邮箱、密码、角色和姓名不能为空" }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "该邮箱已注册" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === "STUDENT") {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          name,
          studentProfile: { create: {} },
        },
      });
    } else if (role === "TEACHER") {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          name,
          teacherProfile: { create: {} },
        },
      });
    } else {
      return NextResponse.json({ message: "角色参数无效" }, { status: 400 });
    }

    const token = jwt.sign(
      {
        id: user.id,             // ✅ 必须是 `id`
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token, role: user.role }, { status: 201 });
  } catch (error) {
    console.error("注册错误", error);
    return NextResponse.json({ message: "服务器错误" }, { status: 500 });
  }
}
