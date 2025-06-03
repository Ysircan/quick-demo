// /app/api/auth/public/courses/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        parentId: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, courses });
  } catch (err) {
    console.error("公开课程获取失败:", err);
    return NextResponse.json({ success: false, error: "课程获取失败" }, { status: 500 });
  }
}
