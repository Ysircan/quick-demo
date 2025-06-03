import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        questions: {
          select: { id: true }, // 只统计数量
        },
      },
    });

    if (!course || !course.isPublished) {
      return NextResponse.json(
        { success: false, error: "课程未找到或未发布" },
        { status: 404 }
      );
    }

    const result = {
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      durationDays: course.durationDays,
      teacher: course.teacher,
      questions: course.questions,
    };

    return NextResponse.json({ success: true, course: result });
  } catch (err) {
    console.error("❌ 获取课程详情失败:", err);
    return NextResponse.json(
      { success: false, error: "服务器错误" },
      { status: 500 }
    );
  }
}
