import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/auth';
import { LibraryListResponse } from '@/lib/api/student';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json<LibraryListResponse>(
        { success: false, courses: [] },
        { status: 401 }
      );
    }

    const enrollments = await prisma.enrolledCourse.findMany({
      where: { studentId: user.id },
      include: {
        course: true,
      },
    });

    const courses = enrollments.map((e) => ({
      courseId: e.courseId,
      title: e.course.title,
      description: e.course.description || '',
      coverImage: e.course.coverImage || '',
      progress: e.progress ?? 0,
    }));

    const result: LibraryListResponse = {
      success: true,
      courses,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('获取课程库失败:', error);
    return NextResponse.json<LibraryListResponse>(
      { success: false, courses: [] },
      { status: 500 }
    );
  }
}
