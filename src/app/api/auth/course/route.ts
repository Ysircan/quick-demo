import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "@/lib/auth";

const prisma = new PrismaClient();

// ✅ 创建课程（支持主课程和子课程）
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
      parentId = null,
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
        price: parseInt(price) || 0, // ✅ 加了 parseInt
    originalPrice: originalPrice ? parseInt(originalPrice) : undefined, // ✅ 同理
    discountPrice: discountPrice ? parseInt(discountPrice) : undefined,
        discountStart: discountStart ? new Date(discountStart) : undefined,
        discountEnd: discountEnd ? new Date(discountEnd) : undefined,
        previewDescription: previewDescription || undefined,
        videoUrl: videoUrl || undefined,
        allowPreview,
        teacherId: user.id,
        parentId: parentId || null,
      },
    });

    return NextResponse.json({ success: true, data: newCourse });
  } catch (err) {
    console.error("课程创建失败:", err);
    return NextResponse.json({ success: false, error: "课程创建失败" }, { status: 500 });
  }
}

// ✅ 获取课程（主课程 or 某主课程下的子课程）
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ success: false, error: "无权限获取课程" }, { status: 401 });
    }

    const url = new URL(req.url);
    const parentId = url.searchParams.get("parentId");
    const parentOnly = url.searchParams.get("parentOnly") === "true";

    let courses = [];

    if (parentId) {
      // 🔹 获取指定主课程的子课程
      courses = await prisma.course.findMany({
        where: {
          teacherId: user.id,
          parentId,
        },
        orderBy: { createdAt: "asc" },
      });
    } else if (parentOnly) {
      // 🔹 获取所有主课程
      courses = await prisma.course.findMany({
        where: {
          teacherId: user.id,
          parentId: null,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "缺少查询参数（请提供 ?parentOnly=true 或 ?parentId=xxx）",
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, courses });
  } catch (err) {
    console.error("获取课程失败:", err);
    return NextResponse.json({ success: false, error: "课程获取失败" }, { status: 500 });
  }
}
