import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
  }

  const { courseId, content, type, options, answer } = await req.json();

  if (!courseId || !content || !type || !answer) {
    return NextResponse.json({ success: false, error: '缺少必要字段' }, { status: 400 });
  }

  try {
    const newQuestion = await prisma.question.create({
      data: {
        courseId,
        type,       // ✅ 题型，如 "choice"
        content,    // ✅ 题干
        options,    // ✅ Json? 可选
        answer,
      },
    });

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (error) {
    console.error('❌ 创建题目失败:', error);
    return NextResponse.json({ success: false, error: '创建失败' }, { status: 500 });
  }
}
