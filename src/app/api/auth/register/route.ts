import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { RegisterRequest } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma"; // ✅ 使用统一实例

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterRequest;
    const { name, email, password, role } = body;

    // 参数校验
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    if (!["STUDENT", "TEACHER"].includes(role)) {
      return NextResponse.json({ error: "无效角色类型" }, { status: 400 });
    }

    // 查重
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
      },
    });

    // 创建学生或老师资料
    if (role === "STUDENT") {
      await prisma.studentProfile.create({ data: { userId: user.id } });
    } else {
      await prisma.teacherProfile.create({ data: { userId: user.id } });
    }

    return NextResponse.json({ message: "注册成功", id: user.id });
  } catch (error) {
    console.error("注册异常:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
