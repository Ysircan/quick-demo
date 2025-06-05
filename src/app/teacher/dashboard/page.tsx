"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [teacherName, setTeacherName] = useState("老师");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTeacherName(data.name || "老师");
        }
      } catch (err) {
        console.error("❌ 获取用户失败", err);
      }
    };

    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/auth/course/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("📦 拉取到课程数据：", data);

        // ✅ 正确读取 published 课程字段
        if (res.ok && data.success && Array.isArray(data.published)) {
          setMyCourses(data.published);
        }
      } catch (err) {
        console.error("❌ 获取课程失败", err);
      }
    };

    fetchUser();
    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <aside className="w-64 bg-[#1f2337] text-white p-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mb-4">
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        {sidebarOpen && (
          <div className="space-y-4 text-sm">
            <button onClick={() => router.push("/teacher/dashboard/course")} className="w-full text-left px-4 py-2 rounded hover:bg-[#2a2f4b]">📚 我的课程</button>
            <button onClick={() => router.push("/teacher/dashboard/card")} className="w-full text-left px-4 py-2 rounded hover:bg-[#2a2f4b]">🧩 我的卡片</button>
            <button onClick={() => router.push("/teacher/dashboard/students")} className="w-full text-left px-4 py-2 rounded hover:bg-[#2a2f4b]">👥 学生情况</button>
          </div>
        )}
      </aside>

      {/* 主区域 */}
      <main className="flex-1 flex flex-col items-center px-6 py-10 text-white">
        <h1 className="text-5xl font-extrabold mb-10 text-center drop-shadow tracking-wide">
          👩‍🏫 欢迎回来，{teacherName}！
        </h1>

        <button
          onClick={() => router.push("/teacher/dashboard/course/create")}
          className="mb-8 bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded shadow"
        >
          ➕ 新建课程
        </button>

        {/* 功能卡片区 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          <button onClick={() => router.push("/teacher/dashboard/course/create")} className="bg-white/5 hover:bg-white/10 backdrop-blur p-8 rounded-2xl shadow-lg text-center w-72 border border-white/10">
            <h2 className="text-xl font-bold mb-2 text-blue-400">📘 创建 / 管理课程</h2>
            <p className="text-sm text-gray-300">出题、排课、编辑内容</p>
          </button>
          <button onClick={() => router.push("/teacher/dashboard/card")} className="bg-white/5 hover:bg-white/10 backdrop-blur p-8 rounded-2xl shadow-lg text-center w-72 border border-white/10">
            <h2 className="text-xl font-bold mb-2 text-blue-400">🃏 管理课程卡片</h2>
            <p className="text-sm text-gray-300">抽卡内容与掉落规则配置</p>
          </button>
        </div>

        {/* 我的课程反馈入口 */}
        {myCourses.length > 0 ? (
          <div className="w-full max-w-5xl">
            <h2 className="text-xl font-bold mb-4">📊 我的课程反馈</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => router.push(`/teacher/dashboard/students/course/${course.id}`)}

                  className="bg-white/5 hover:bg-white/10 backdrop-blur p-6 rounded-xl border border-white/10 cursor-pointer transition"
                >
                  <h3 className="text-lg font-semibold text-blue-300 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-300">{course.description || "暂无简介"}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 mt-8">暂无已发布课程</p>
        )}
      </main>
    </div>
  );
}
