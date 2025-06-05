import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ success: false, error: "无权限查看反馈" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ success: false, error: "缺少课程 ID" }, { status: 400 });
    }

    const feedbacks = await prisma.questionFeedback.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
      include: {
        student: true,
        question: true,
      },
    });

    console.log("🟢 查询反馈数据 courseId:", courseId);
    console.log("🟡 查询结果:", feedbacks.length);

    const result = feedbacks.map((f) => ({
      courseId: f.courseId, // ✅ 添加用于前端跳转
      studentName: f.student.name,
      questionContent: f.question?.content || "题干缺失",
      studentAnswer: f.answer,
      isCorrect: f.isCorrect,
      aiUsed: f.aiUsed || false,
      reviewed: f.reviewed,
      submittedAt: f.createdAt,
    }));

    return NextResponse.json({ success: true, records: result });

  } catch (error: any) {
    console.error("❌ 获取反馈失败:", error);
    return NextResponse.json({ success: false, error: "服务器错误" }, { status: 500 });
  }
}
