"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthRedirect } from "@/hooks/useAuthRedirect"; // ✅ 引入 Hook
import type { TaskItem } from "@/lib/api/student";
import type { FeedbackSubmitRequest } from "@/lib/api/feedback";

export default function TaskPage() {
  useAuthRedirect(["STUDENT"]); // ✅ 限制仅学生访问

  const { courseid } = useParams();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token || typeof courseid !== "string") {
        setError("请先登录或课程 ID 无效");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/task/${courseid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (res.ok && result.success) {
          setTasks(result.tasks);
        } else {
          throw new Error(result.error || "加载失败");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [courseid]);

  const handleSubmit = async (questionId: string) => {
    const token = localStorage.getItem("token");
    const answer = answers[questionId]?.trim();

    if (!token || !answer || typeof courseid !== "string") {
      alert("请填写答案或登录失效");
      return;
    }

    const isCorrect = answer === "正确答案"; // 后续替换为真实逻辑

    const payload: FeedbackSubmitRequest = {
      courseId: courseid,
      questionId,
      answer,
      isCorrect,
    };

    const res = await fetch("/api/auth/feedback/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.ok && result.success) {
      alert("✅ 提交成功！");
    } else {
      alert("❌ 提交失败: " + result.error);
    }
  };

  if (loading) return <div className="p-6 text-white">加载中...</div>;
  if (error) return <div className="p-6 text-red-500">❌ {error}</div>;

  return (
    <div className="p-6 text-white max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📘 开始答题</h1>
      {tasks.length === 0 ? (
        <p>暂无题目可做</p>
      ) : (
        <ul className="space-y-6">
          {tasks.map((task, index) => (
            <li key={task.questionId} className="bg-[#1a1a1a] p-5 rounded">
              <p className="mb-2">
                <strong>Q{index + 1}.</strong> {task.content}
              </p>

              {task.options.length > 0 && (
                <ul className="pl-4 list-disc mb-2 text-sm text-gray-300">
                  {task.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              )}

              <input
                type="text"
                className="w-full p-2 bg-gray-800 text-white rounded mb-2"
                placeholder="请输入你的答案"
                value={answers[task.questionId] || ""}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [task.questionId]: e.target.value,
                  }))
                }
              />

              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white"
                onClick={() => handleSubmit(task.questionId)}
              >
                提交答案
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
