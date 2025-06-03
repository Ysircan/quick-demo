import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/app/api/utils/auth';

const prisma = new PrismaClient();

/**
 * 批量保存题目接口（POST）
 * 访问路径: /api/auth/question/batch
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json({ success: false, error: '无权限' }, { status: 403 });
    }

    const body = await req.json();
    const { courseId, questions } = body;

    if (!courseId || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ success: false, error: '参数缺失或格式错误' }, { status: 400 });
    }

    const formatted = questions.map((q: any) => ({
      courseId,
      content: q.content,
      type: q.type,
      options: q.options ?? [],
      answer: q.answer,
      explanation: q.explanation ?? null,
      authorId: user.id,
    }));

    const result = await prisma.question.createMany({
      data: formatted,
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error('❌ 批量保存题目失败:', error);
    return NextResponse.json({ success: false, error: '服务器错误' }, { status: 500 });
  }
}
