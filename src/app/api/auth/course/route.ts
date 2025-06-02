import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "@/lib/auth";

const prisma = new PrismaClient();

// ✅ 创建课程（只允许主课程）
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ success: false, error: "无权限创建课程" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      tags = [],
      type,
      category,
      difficulty,
      durationDays,
      coverImage,
      price = "0",
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

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        tags,
        type,
        category: category || undefined,
        difficulty,
        durationDays,
        coverImage: coverImage || undefined,
        price: parseInt(price) || 0,
        originalPrice: originalPrice ? parseInt(originalPrice) : undefined,
        discountPrice: discountPrice ? parseInt(discountPrice) : undefined,
        discountStart: discountStart ? new Date(discountStart) : undefined,
        discountEnd: discountEnd ? new Date(discountEnd) : undefined,
        previewDescription: previewDescription || undefined,
        videoUrl: videoUrl || undefined,
        allowPreview,
        teacherId: user.id,
        parentId: null, // 强制设置为主课程
      },
    });

    return NextResponse.json({ success: true, data: newCourse });
  } catch (err) {
    console.error("课程创建失败:", err);
    return NextResponse.json({ success: false, error: "课程创建失败" }, { status: 500 });
  }
}

// ✅ 获取所有主课程（忽略子课程）
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ success: false, error: "无权限获取课程" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      where: {
        teacherId: user.id,
        parentId: null, // 只取主课程
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, courses });
  } catch (err) {
    console.error("获取课程失败:", err);
    return NextResponse.json({ success: false, error: "课程获取失败" }, { status: 500 });
  }
}
