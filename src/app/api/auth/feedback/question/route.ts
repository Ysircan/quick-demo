import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { FeedbackSubmitRequest, FeedbackSubmitResponse } from "@/lib/api/feedback";

export async function POST(req: NextRequest): Promise<NextResponse<FeedbackSubmitResponse>> {
  try {
    // 🧑‍🎓 获取用户身份
    const user = await getUserFromToken(req);
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ success: false, error: "无权限提交反馈" }, { status: 401 });
    }

    // 📥 解析请求体
    const body = (await req.json()) as FeedbackSubmitRequest;
    const { courseId, questionId, answer, isCorrect, aiUsed = false } = body;

    // ⚠️ 校验参数
    if (!courseId || !questionId || typeof answer !== "string") {
      return NextResponse.json({ success: false, error: "缺少必要参数" }, { status: 400 });
    }

    // 📝 写入 QuestionFeedback 表
    await prisma.questionFeedback.create({
      data: {
        studentId: user.id,
        courseId,
        questionId,
        answer,
        isCorrect,
        aiUsed,
        reviewed: false,
      },
    });

    // 🔁 同步更新 EnrolledCourseTask
    await prisma.enrolledCourseTask.updateMany({
      where: {
        questionId,
        enrolledCourse: {
          studentId: user.id,
          courseId,
        },
      },
      data: {
        answer,
        isCorrect,
        aiUsed,
        submittedAt: new Date(),
        reviewed: false,
        resolved: false,
        lastTriedAt: new Date(),
        redoCount: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ 提交反馈失败:", error);
    return NextResponse.json({ success: false, error: "服务器错误" }, { status: 500 });
  }
}
