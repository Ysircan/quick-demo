import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from '@/lib/auth'

// ✅ GET：获取课程详情
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
  }

  const course = await prisma.course.findFirst({
    where: {
      id,
      teacherId: user.id,
    },
    include: {
      questions: true,
    },
  });

  if (!course) {
    return NextResponse.json({ success: false, error: '未找到课程' }, { status: 404 });
  }

  return NextResponse.json({ success: true, course });
}

// ✅ POST：切换发布状态（发布/撤销发布）
export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
  }

  const course = await prisma.course.findFirst({
    where: {
      id,
      teacherId: user.id,
    },
  });

  if (!course) {
    return NextResponse.json({ success: false, error: '课程不存在' }, { status: 404 });
  }

  const updated = await prisma.course.update({
    where: { id },
    data: {
      isPublished: !course.isPublished,
    },
  });

  return NextResponse.json({ success: true, course: updated });
}

// ✅ DELETE：删除课程
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ success: false, error: '未授权' }, { status: 401 });
  }

  const course = await prisma.course.findFirst({
    where: {
      id,
      teacherId: user.id,
    },
  });

  if (!course) {
    return NextResponse.json({ success: false, error: '课程不存在' }, { status: 404 });
  }

  await prisma.course.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, message: '课程已删除' });
}
// ✅ PUT：更新课程标题与描述
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromToken(req)
  if (!user) {
    return NextResponse.json({ success: false, error: '未授权' }, { status: 401 })
  }

  const { title, description } = await req.json()

  try {
    const updatedCourse = await prisma.course.update({
      where: {
        id: params.id,
        teacherId: user.id,
      },
      data: {
        title,
        description,
      },
    })

    return NextResponse.json({ success: true, course: updatedCourse })
  } catch (error) {
    return NextResponse.json({ success: false, error: '更新失败' }, { status: 500 })
  }
}
