"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const parentIdFromQuery = searchParams?.get("parentId");
  const displayParentId = course?.parentId || parentIdFromQuery || null;

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
    <div style={{ padding: 24, maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
      <h1>✏️ 编辑课程</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>标题：</label>
      <input
        name="title"
        value={course.title}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <label>描述：</label>
      <textarea
        name="description"
        value={course.description}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <label>类型：</label>
      <select
        name="type"
        value={course.type}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 8 }}
      >
        <option value="MAIN">主课</option>
        <option value="PRACTICE">练习</option>
        <option value="EXAM">测验</option>
      </select>

      <label>难度：</label>
      <select
        name="difficulty"
        value={course.difficulty}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 8 }}
      >
        <option value="EASY">简单</option>
        <option value="MEDIUM">中等</option>
        <option value="HARD">困难</option>
      </select>

      <label>周期（天）：</label>
      <input
        name="durationDays"
        type="number"
        value={course.durationDays}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <label style={{ display: "block", marginTop: 12 }}>
        <input
          type="checkbox"
          name="isPublished"
          checked={course.isPublished}
          onChange={handleChange}
        />
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
    </div>
  );
}
