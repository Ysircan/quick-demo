"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  durationDays: number;
}

export default function StudentCourseStorePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/auth/course/public?published=true");
        const data = await res.json();
        setCourses(data.courses);
      } catch (err) {
        console.error("获取课程失败", err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">课程商店</h1>
      {courses.length === 0 && <p>暂无可用课程</p>}
      {courses.map((course) => (
        <div
          key={course.id}
          className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100"
          onClick={() => router.push(`/student/course/${course.id}`)}
        >
          <h2 className="text-xl font-semibold">{course.title}</h2>
          <p className="text-sm text-gray-600">{course.description}</p>
          <p className="mt-2 text-sm">难度：{course.difficulty}</p>
          <p className="text-sm">周期：{course.durationDays} 天</p>
          <p className="mt-1 text-blue-600 underline">点击查看详情</p>
        </div>
      ))}
    </div>
  );
}
