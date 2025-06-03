"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StudentNavbar from "@/components/StudentNavbar"; // ✅ 导入导航栏组件

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  durationDays: number;
  teacher?: {
    name: string;
    avatarUrl?: string;
  };
}

export default function StudentCourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/auth/course/public/course/${id}`);
        const data = await res.json();
        if (res.ok) {
          setCourse(data.course);
        } else {
          setError(data.error || "无法加载课程信息");
        }
      } catch (err) {
        setError("获取课程失败");
      }
    };

    if (id) fetchCourse();
  }, [id]);

  const handleStart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("请先登录");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: id }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        router.push("/student/store/library"); 
      } else {
        alert(result.error || "领取失败");
      }
    } catch (err) {
      alert("操作失败");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-6 text-red-500">❌ {error}</div>;
  if (!course) return <div className="p-6">加载中...</div>;

  return (
    <>
      <StudentNavbar /> {/* ✅ 插入导航栏组件 */}
      <div className="p-6 space-y-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-gray-700">{course.description}</p>

        <div className="text-sm text-gray-600 space-y-1 pt-2">
          <p>难度：{course.difficulty}</p>
          <p>周期：{course.durationDays} 天</p>
          {course.teacher && (
            <div className="flex items-center gap-2 pt-2">
              <img
                src={course.teacher.avatarUrl || "/default-avatar.png"}
                alt="teacher"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{course.teacher.name}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "处理中..." : "开始学习"}
        </button>
      </div>
    </>
  );
}
