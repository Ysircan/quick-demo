import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CreateCourseRequest, CourseResponse } from "@/lib/api/course";
import { getUserFromToken } from "@/lib/auth";

const prisma = new PrismaClient();

// ✅ 创建课程（POST）
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    const body = (await req.json()) as CreateCourseRequest;

    console.log("📦 接收到课程创建请求:");
    console.log("👤 当前用户:", user);
    console.log("📝 请求体:", body);

    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ success: false, error: "无权限创建课程" }, { status: 401 });
    }

    const {
      title,
      description,
      tags = [],
      type,
      category,
      difficulty,
      durationDays,
      coverImage,
      price = 0,
      originalPrice,
      discountPrice,
      discountStart,
      discountEnd,
      previewDescription,
      videoUrl,
      allowPreview = false,
    } = body;

    if (!title || !description || !type || !difficulty || !durationDays) {
      return NextResponse.json({ success: false, error: "缺少必要字段" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        tags,
        type,
        category: category || undefined,
        difficulty,
        durationDays,
        coverImage: coverImage || undefined,
        price,
        originalPrice: originalPrice ?? undefined,
        discountPrice: discountPrice ?? undefined,
        discountStart: discountStart ? new Date(discountStart) : undefined,
        discountEnd: discountEnd ? new Date(discountEnd) : undefined,
        previewDescription: previewDescription || undefined,
        videoUrl: videoUrl || undefined,
        allowPreview,
        teacherId: user.id,
      },
    });

    const response: CourseResponse = {
      id: course.id,
      title: course.title,
      description: course.description,
      tags: course.tags,
      type: course.type,
      category: course.category ?? "",
      difficulty: course.difficulty,
      durationDays: course.durationDays,
      coverImage: course.coverImage ?? "",
      price: course.price,
      originalPrice: course.originalPrice ?? 0,
      discountPrice: course.discountPrice ?? 0,
      discountStart: course.discountStart?.toISOString() ?? "",
      discountEnd: course.discountEnd?.toISOString() ?? "",
      previewDescription: course.previewDescription ?? "",
      videoUrl: course.videoUrl ?? "",
      allowPreview: course.allowPreview,
      isPublished: course.isPublished,
      enrollment: course.enrollment,
      rating: course.rating ?? 0,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("课程创建失败:", error);
    return NextResponse.json({ success: false, error: "课程创建失败" }, { status: 500 });
  }
}

// ✅ 获取当前老师的课程列表（GET）
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ success: false, error: "无权限获取课程" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      where: { teacherId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("获取课程失败:", error);
    return NextResponse.json({ success: false, error: "课程获取失败" }, { status: 500 });
  }
}
