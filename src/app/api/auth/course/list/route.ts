// src/app/api/auth/course/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);

  if (!user || !user.id) {
    return NextResponse.json({ success: false, error: "未授权" }, { status: 401 });
  }

  try {
    const allCourses = await prisma.course.findMany({
      where: { teacherId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        questions: true, // ✅ 包含题目数量
      },
    });

    const drafts = allCourses.filter(course => !course.isPublished);
    const published = allCourses.filter(course => course.isPublished);

    return NextResponse.json({
      success: true,
      drafts,
      published,
    });
  } catch (error) {
    console.error("❌ 获取课程列表失败:", error);
    return NextResponse.json({ success: false, error: "服务器错误" }, { status: 500 });
  }
}
