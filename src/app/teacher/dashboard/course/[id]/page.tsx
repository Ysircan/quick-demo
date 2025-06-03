"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const searchParams = useSearchParams();

  const parentIdFromQuery = searchParams?.get("parentId");
  const displayParentId = course?.parentId || parentIdFromQuery || null;

  // ✅ 获取课程信息
  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/auth/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (res.ok && result.course) {
        setCourse(result.course);
      } else {
        setError("加载课程失败");
      }
    };

    fetchCourse();
  }, [id]);

  // ✅ 获取课程题目
  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/auth/question/list?courseId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (res.ok && result.questions) {
        setQuestions(result.questions);
      }
    };

    fetchQuestions();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setCourse((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/auth/course/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: course.title,
        description: course.description,
        type: course.type,
        difficulty: course.difficulty,
        durationDays: Number(course.durationDays),
        isPublished: course.isPublished,
      }),
    });

    const result = await res.json();
    if (res.ok && result.success) {
      router.push("/teacher/dashboard/course");
    } else {
      setError(result.error || "保存失败");
    }
    setLoading(false);
  };

  if (!course) return <div style={{ padding: 24 }}>加载中...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 720, fontFamily: "system-ui, sans-serif" }}>
      <h1>✏️ 编辑课程</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 📝 编辑课程表单 */}
      <label>标题：</label>
      <input name="title" value={course.title} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }} />

      <label>描述：</label>
      <textarea name="description" value={course.description} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }} />

      <label>类型：</label>
      <select name="type" value={course.type} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }}>
        <option value="MAIN">主课</option>
        <option value="PRACTICE">练习</option>
        <option value="EXAM">测验</option>
      </select>

      <label>难度：</label>
      <select name="difficulty" value={course.difficulty} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }}>
        <option value="EASY">简单</option>
        <option value="MEDIUM">中等</option>
        <option value="HARD">困难</option>
      </select>

      <label>周期（天）：</label>
      <input name="durationDays" type="number" value={course.durationDays} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }} />

      <label style={{ display: "block", marginTop: 12 }}>
        <input type="checkbox" name="isPublished" checked={course.isPublished} onChange={handleChange} />
        发布课程
      </label>

      {displayParentId && (
        <div style={{ marginTop: 8, fontSize: 14, color: "#555" }}>
          父课程 ID：{displayParentId}
        </div>
      )}

      <div style={{ paddingTop: 20 }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "保存中..." : "💾 保存修改"}
        </button>
      </div>

      {/* 📚 题目列表展示区 */}
      <div style={{ marginTop: 48 }}>
        <h2>📚 当前课程题目列表</h2>

        <button
          onClick={() => router.push(`/teacher/dashboard/course/${id}/generate`)}
          style={{ marginBottom: 16, padding: "6px 12px" }}
        >
          ➕ 添加题目（AI 出题）
        </button>
{questions.length === 0 ? (
  <p style={{ color: "#ccc", fontStyle: "italic", marginTop: 12 }}>
    暂无题目，请使用 AI 出题或手动添加。
  </p>
) : (
  questions.map((q: any, idx: number) => (
    <div
      key={q.id}
      style={{
        marginBottom: 16,
        padding: 16,
        border: "1px solid #444",
        borderRadius: 8,
        backgroundColor: "#1f1f1f",
        color: "#fff",
        boxShadow: "0 0 4px rgba(255,255,255,0.1)",
      }}
    >
      <div><strong style={{ color: "#00d4ff" }}>题目 {idx + 1}：</strong> {q.content}</div>
      <div style={{ marginTop: 4 }}><strong>类型：</strong> {q.type}</div>

      {q.options?.length > 0 && (
        <div style={{ marginTop: 4 }}>
          <strong>选项：</strong>
          <ul style={{ paddingLeft: 20, marginTop: 4 }}>
            {q.options.map((opt: string, i: number) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 4 }}><strong>答案：</strong> {q.answer}</div>

      {q.explanation && (
        <div style={{ marginTop: 4, color: "#aaa" }}>
          <strong>解析：</strong> {q.explanation}
        </div>
      )}

      <button
        onClick={() => router.push(`/teacher/dashboard/question/${q.id}/edit`)}
        style={{
          marginTop: 12,
          padding: "6px 12px",
          backgroundColor: "#333",
          color: "#fff",
          border: "1px solid #666",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        ✏️ 编辑
      </button>
      <button
  onClick={async () => {
    const confirmed = confirm("确定要删除这道题吗？此操作不可撤销。");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/auth/question/${q.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (res.ok && result.success) {
      // ✅ 删除成功后刷新题目列表
      setQuestions((prev) => prev.filter((item) => item.id !== q.id));
    } else {
      alert("删除失败：" + result.error);
    }
  }}
  style={{
    marginTop: 8,
    marginLeft: 12,
    padding: "6px 12px",
    backgroundColor: "#700",
    color: "white",
    border: "1px solid #933",
    borderRadius: 4,
    cursor: "pointer",
  }}
>
  🗑️ 删除
</button>

    </div>
  ))
)}

      </div>
    </div>
  );
}
