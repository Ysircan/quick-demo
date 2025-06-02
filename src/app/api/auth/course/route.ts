import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    // ✅ 用户身份校验
    if (!user || !user.id) {
      return NextResponse.json({ error: "未授权，无法识别用户" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      coverImage,
      tags,
      type,
      difficulty,
      durationDays,
      price,
      structure,
      questions,
    } = body;

    // ✅ 打印 questions 结构，调试用
    console.log("🟡 接收到 questions：", JSON.stringify(questions, null, 2));

    // ✅ 防御性检查
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "题目列表无效或为空" }, { status: 400 });
    }

    // ✅ 课程创建 + 嵌套题目，同时逐题校验（防止格式问题）
    const course = await prisma.course.create({
      data: {
        title,
        description,
        coverImage,
        tags,
        type,
        difficulty,
        durationDays,
        price,
        structure,
        teacherId: user.id,
        questions: {
          create: questions.map((q: any, index: number) => {
            if (!q.type || !q.content || !q.answer) {
              throw new Error(`第 ${index + 1} 题缺少字段: ${JSON.stringify(q)}`);
            }
            return {
              type: q.type,
              content: q.content,
              answer: q.answer,
              options: q.options ?? undefined,
            };
          }),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (err: any) {
    console.error("❌ 创建课程出错:", err);
    return NextResponse.json(
      {
        error: "服务器内部错误",
        detail: err.message || String(err),
      },
      { status: 500 }
    );
  }
}
