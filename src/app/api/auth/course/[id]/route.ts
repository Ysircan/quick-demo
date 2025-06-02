import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "@/app/api/utils/auth";

const prisma = new PrismaClient();

/**
 * 编辑课程接口（PUT）
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ success: false, error: "无权限" }, { status: 403 });
    }

    const courseId = params.id;
    const body = await req.json();

    const {
      title,
      description,
      coverImage,
      tags = [],
      type,
      category,
      difficulty,
      durationDays,
      price = 0,
      originalPrice,
      discountPrice,
      discountStart,
      discountEnd,
      isPublished,
      allowPreview,
      previewDescription,
      videoUrl,
      isPrimary = true,
      parentId,
    } = body;

    if (!title || !description || !type || !difficulty || !durationDays) {
      return NextResponse.json({ success: false, error: "缺少必要字段" }, { status: 400 });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        coverImage: coverImage || undefined,
        tags,
        type,
        category: category || undefined,
        difficulty,
        durationDays,
        price,
        originalPrice: originalPrice ?? undefined,
        discountPrice: discountPrice ?? undefined,
        discountStart: discountStart ? new Date(discountStart) : undefined,
        discountEnd: discountEnd ? new Date(discountEnd) : undefined,
        isPublished,
        allowPreview,
        previewDescription: previewDescription || undefined,
        videoUrl: videoUrl || undefined,
        isPrimary,
        parentId: parentId || undefined,
      },
    });

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error("编辑课程失败:", error);
    return NextResponse.json({ success: false, error: "内部服务器错误" }, { status: 500 });
  }
}

/**
 * 删除课程接口（DELETE）
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ success: false, error: "无权限" }, { status: 403 });
    }

    const courseId = params.id;

    // 🔥 删除所有关联记录（如无级联删除）
    await prisma.question.deleteMany({ where: { courseId } });
    await prisma.enrolledCourse.deleteMany({ where: { courseId } });
    await prisma.dailyDropLog.deleteMany({ where: { courseId } });
    await prisma.studentSessionLog.deleteMany({ where: { courseId } });
    await prisma.courseCardSet.deleteMany({ where: { courseId } });

    // 解除子课程的 parentId 依赖
    await prisma.course.updateMany({
      where: { parentId: courseId },
      data: { parentId: null },
    });

    // 删除主课程
    await prisma.course.delete({ where: { id: courseId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除课程失败:", error);
    return NextResponse.json({ success: false, error: "删除失败" }, { status: 500 });
  }
}
