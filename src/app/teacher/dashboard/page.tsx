"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function TeacherDashboardPage() {
  const [teacherName, setTeacherName] = useState("老师");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

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
      } catch (error) {
        console.error("请求错误:", error);
      }
    };

    fetchUser();
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
            <button
              onClick={() => router.push("/teacher/dashboard/course")}
              className="block w-full text-left px-4 py-2 rounded hover:bg-[#2a2f4b]"
            >
              📚 我的课程
            </button>
            <button
              onClick={() => router.push("/teacher/dashboard/card")}
              className="block w-full text-left px-4 py-2 rounded hover:bg-[#2a2f4b]"
            >
              🧩 我的卡片
            </button>
            <button
              onClick={() => router.push("/teacher/dashboard/students")}
              className="block w-full text-left px-4 py-2 rounded hover:bg-[#2a2f4b]"
            >
              👥 学生情况
            </button>
          </div>
        )}
      </aside>

      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-5xl font-extrabold mb-10 text-center drop-shadow tracking-wide">
          👩‍🏫 欢迎回来，{teacherName}！
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <button
            onClick={() => router.push("/teacher/dashboard/course/create")}
            className="bg-white/5 hover:bg-white/10 backdrop-blur p-8 rounded-2xl shadow-lg text-center w-72 border border-white/10"
          >
            <h2 className="text-xl font-bold mb-2 text-blue-400">📘 创建 / 管理课程</h2>
            <p className="text-sm text-gray-300">出题、排课、编辑内容</p>
          </button>

          <button
            onClick={() => router.push("/teacher/dashboard/card")}
            className="bg-white/5 hover:bg-white/10 backdrop-blur p-8 rounded-2xl shadow-lg text-center w-72 border border-white/10"
          >
            <h2 className="text-xl font-bold mb-2 text-blue-400">🃏 管理课程卡片</h2>
            <p className="text-sm text-gray-300">管理抽卡内容与掉落规则</p>
          </button>
        </div>
      </main>
    </div>
  );
}
