"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

interface FeedbackRecord {
  studentName: string;
  questionContent: string;
  studentAnswer: string;
  isCorrect: boolean;
  aiUsed?: boolean;
  reviewed: boolean;
  submittedAt: string;
  courseId: string;
}

export default function FeedbackListPage() {
  useAuthRedirect(["TEACHER"]);

  const router = useRouter();
  const params = useParams();
  const courseId = typeof params.id === "string" ? params.id : "";

  const [records, setRecords] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem("token");
      if (!token || !courseId) {
        setError("未登录或课程 ID 无效");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/feedback/teacher?courseId=${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        if (res.ok && result.success && Array.isArray(result.records)) {
          setRecords(result.records);
        } else {
          throw new Error(result.error || "获取失败");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [courseId]);

  if (loading) return <div className="p-6 text-white">加载中...</div>;
  if (error) return <div className="p-6 text-red-500">❌ {error}</div>;

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📊 课程反馈记录</h1>
        <button
          onClick={() => router.push(`/teacher/dashboard`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          返回教师首页
        </button>
      </div>

      {records.length === 0 ? (
        <p>暂无学生提交反馈。</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-left">
              <tr>
                <th className="p-3">学生</th>
                <th className="p-3">题目内容</th>
                <th className="p-3">提交答案</th>
                <th className="p-3">是否正确</th>
                <th className="p-3">AI辅助</th>
                <th className="p-3">提交时间</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => (
                <tr key={i} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{rec.studentName}</td>
                  <td className="p-3">{rec.questionContent}</td>
                  <td className="p-3">{rec.studentAnswer}</td>
                  <td className="p-3">{rec.isCorrect ? "✅" : "❌"}</td>
                  <td className="p-3">{rec.aiUsed ? "是" : "否"}</td>
                  <td className="p-3">{new Date(rec.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
