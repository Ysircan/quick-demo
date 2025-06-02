"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StudentDashboard() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("学员");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setStudentName(data.name || "学员");
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return <div className="text-white p-10">加载中...</div>;

  return (
    <div className="p-10 text-white min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-3xl font-bold mb-6">🎓 欢迎回来，{studentName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <DashboardCard
          title="📘 任务课程"
          description="查看并完成老师发布的任务。"
          href="/student/dashboard/task"
        />
        <DashboardCard
          title="🎴 卡牌图鉴"
          description="查看你已收集的所有学习卡牌。"
          href="/student/dashboard/card"
        />
        <DashboardCard
          title="❌ 错题集"
          description="回顾你做错的题目并进行复习。"
          href="/student/dashboard/mistake"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white/5 border border-white/10 hover:bg-white/10 p-6 rounded-xl transition cursor-pointer shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-blue-300">{title}</h2>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </Link>
  );
}
