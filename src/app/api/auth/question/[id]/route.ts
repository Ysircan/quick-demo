import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: params.id },
    });

    if (!question) {
      return NextResponse.json({ success: false, error: '题目不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true, question });
  } catch (error: any) {
    console.error("❌ 获取题目失败:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json({ success: false, error: '无权限编辑题目' }, { status: 401 });
    }

    const questionId = params.id;
    const body = await req.json();

    const updated = await prisma.question.update({
      where: { id: questionId },
      data: {
        content: body.content,
        type: body.type,
        options: body.options,
        answer: body.answer,
        explanation: body.explanation,
        difficulty: body.difficulty,
        score: body.score,
        allowRepeat: body.allowRepeat,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, question: updated });
  } catch (error: any) {
    console.error("❌ 编辑题目失败:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json({ success: false, error: '无权限删除题目' }, { status: 401 });
    }

    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: { course: true },
    });

    if (!question || question.course.teacherId !== user.id) {
      return NextResponse.json({ success: false, error: '无权限删除此题目' }, { status: 403 });
    }

    await prisma.question.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ 删除题目失败:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
