// 文件路径：src/app/api/question/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/auth';
import { QuestionResponse } from '@/lib/api/question';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json({ success: false, error: '无权限访问题目列表' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ success: false, error: '缺少课程ID' }, { status: 400 });
    }

    const questions = await prisma.question.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });

    const response: QuestionResponse[] = questions.map((q) => ({
      id: q.id,
      type: q.type as any,
      content: q.content,
      options: q.options || undefined,
      answer: q.answer,
      explanation: q.explanation || undefined,
      createdAt: q.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, questions: response });
  } catch (error) {
    console.error('获取题目列表失败:', error);
    return NextResponse.json({ success: false, error: '服务器内部错误' }, { status: 500 });
  }
}
