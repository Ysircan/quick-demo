import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { BatchSaveQuestionRequest } from '@/lib/api/question';
import { getUserFromToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json({ success: false, error: '无权限访问' }, { status: 401 });
    }

    const body = (await req.json()) as BatchSaveQuestionRequest;
    const { courseId, questions } = body;

    if (!courseId || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ success: false, error: '参数不完整' }, { status: 400 });
    }

    const createdQuestions = await Promise.all(
      questions.map((q) =>
        prisma.question.create({
          data: {
            courseId,
            content: q.content,
            type: q.type,
            options: q.options || [],
            answer: q.answer,
            explanation: q.explanation || '',
            authorId: user.id,
            isActive: true,
          },
        })
      )
    );

    return NextResponse.json({ success: true, created: createdQuestions.length });
  } catch (error) {
    console.error('[❌ 保存题目错误]', error);
    return NextResponse.json({ success: false, error: '服务器错误' }, { status: 500 });
  }
} 
