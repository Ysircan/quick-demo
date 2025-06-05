"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import type { TaskItem } from "@/lib/api/student";

export default function CourseUnpackPage() {
  useAuthRedirect(["STUDENT"]); // ✅ 限制仅学生访问

  const { courseid } = useParams();
  const router = useRouter();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("请先登录");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/task/${courseid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const raw = await res.text();
          console.error("⚠️ 非 JSON 返回:", raw);
          throw new Error("服务器返回异常数据");
        }

        const result = await res.json();

        if (res.ok && result?.success && Array.isArray(result.tasks)) {
          setTasks(result.tasks);
        } else {
          const msg =
            typeof result?.error === "string"
              ? result.error
              : "任务加载失败，请稍后重试";
          setError(msg);
        }
      } catch (err: any) {
        console.error("❌ 请求失败:", err);
        setError(err.message || "网络错误，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    if (typeof courseid === "string") {
      fetchTasks();
    } else {
      setError("课程 ID 无效");
      setLoading(false);
    }
  }, [courseid]);

  const handleStart = () => {
    if (typeof courseid === "string") {
      router.push(`/student/task/${courseid}`);
    } else {
      alert("课程 ID 无效，无法跳转");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold mb-6">📦 解包课程任务中</h1>

      {loading ? (
        <p className="text-gray-400">正在加载题目...</p>
      ) : error ? (
        <p className="text-red-500 whitespace-pre-line">{error}</p>
      ) : (
        <>
          <p className="mb-4 text-lg">
            你将面对 <span className="font-bold">{tasks.length}</span> 道题目
          </p>
          <button
            onClick={handleStart}
            className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded text-white text-lg"
          >
            🚀 开始答题
          </button>
        </>
      )}
    </div>
  );
}
