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

  const handleStartCourse = async (courseId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("请先登录");
      return;
    }

    try {
      const res = await fetch("/api/student-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      if (res.ok) {
        router.push("/student/task");
      } else {
        const error = await res.json();
        alert("领取失败：" + error?.message || "未知错误");
      }
    } catch (err) {
      console.error("领取课程失败", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">课程商店</h1>
      {courses.length === 0 && <p>暂无可用课程</p>}
      {courses.map((course) => (
        <div key={course.id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">{course.title}</h2>
          <p>{course.description}</p>
          <p>难度：{course.difficulty}</p>
          <p>周期：{course.durationDays} 天</p>
          <button
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
            onClick={() => handleStartCourse(course.id)}
          >
            开始学习
          </button>
        </div>
      ))}
    </div>
  );
}
