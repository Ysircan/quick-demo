import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: { courseid: string } }) {
  try {
    const user = await getUserFromToken(req);

    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ success: false, error: "无权限访问" }, { status: 401 });
    }

    // 1. 查询是否已报名该课程
    const enrolled = await prisma.enrolledCourse.findFirst({
      where: {
        studentId: user.id,
        courseId: params.courseid,
      },
    });

    if (!enrolled) {
      return NextResponse.json({ success: false, error: "未报名该课程" }, { status: 403 });
    }

    // 2. 查询已存在的任务（避免重复创建）
    const existingTasks = await prisma.enrolledCourseTask.findMany({
      where: { enrolledCourseId: enrolled.id },
    });

    if (existingTasks.length === 0) {
      // 3. 第一次访问，自动生成任务
      const courseQuestions = await prisma.question.findMany({
        where: { courseId: params.courseid },
      });

      const newTasksData = courseQuestions.map((q) => ({
        enrolledCourseId: enrolled.id,
        questionId: q.id,
        status: TaskStatus.PENDING,
      }));

      if (newTasksData.length > 0) {
        await prisma.enrolledCourseTask.createMany({
          data: newTasksData,
        });
      }
    }

    // 4. 重新拉取绑定的任务及题目信息
    const taskItems = await prisma.enrolledCourseTask.findMany({
      where: { enrolledCourseId: enrolled.id },
      include: { question: true },
    });

    const tasks = taskItems
      .filter((item) => item.question !== null)
      .map((item) => ({
        questionId: item.question!.id,
        content: item.question!.content,
        options: item.question!.options ?? [],
        type: item.question!.type ?? "SINGLE",
        status: item.status,
      }));

    return NextResponse.json({ success: true, tasks });
  } catch (err) {
    console.error("❌ 解包失败:", err);
    return NextResponse.json({ success: false, error: "服务器错误" }, { status: 500 });
  }
}
