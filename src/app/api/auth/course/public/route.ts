// src/app/api/public/courses/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: {
        questions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json({ success: false, error: "无法获取课程" }, { status: 500 });
  }
}
