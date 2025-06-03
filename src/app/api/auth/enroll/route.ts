import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: '未登录或无权限' }, { status: 401 });
    }

    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ success: false, error: '缺少课程ID' }, { status: 400 });
    }

    // 检查是否已报名过该课程
    const existing = await prisma.enrolledCourse.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        enrolledCourseId: existing.id,
        message: '已报名',
      });
    }

    // 创建新报名记录
    const enrolled = await prisma.enrolledCourse.create({
      data: {
        studentId: user.id,
        courseId,
      },
    });

    return NextResponse.json({
      success: true,
      enrolledCourseId: enrolled.id,
    });
  } catch (error) {
    console.error('报名课程失败:', error);
    return NextResponse.json({ success: false, error: '服务器错误' }, { status: 500 });
  }
}
