"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CoursePage() {
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter();

  // 🔄 获取课程列表
  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/auth/course", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      const result = JSON.parse(text);

      if (res.ok && result.success) {
        setCourses(result.courses);
      } else {
        console.warn("⚠️ 获取课程失败:", result.error);
      }
    } catch (err) {
      console.error("❌ 拉取课程失败:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🔧 通用课程更新函数
  const updateCourse = async (course: any, updateData: any) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/auth/course/${course.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        // 合并基础字段和更新字段
        title: course.title,
        description: course.description,
        type: course.type,
        difficulty: course.difficulty,
        durationDays: course.durationDays,
        ...updateData,
      }),
    });

    if (res.ok) {
      await fetchCourses();
    } else {
      alert("操作失败，请稍后重试。");
    }
  };

  const handlePublish = (course: any) =>
    updateCourse(course, { isPublished: true });

  const handleUnpublish = (course: any) =>
    updateCourse(course, { isPublished: false });

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("确认删除该课程吗？此操作不可撤销！");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/auth/course/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      await fetchCourses();
    } else {
      alert("删除失败，请稍后重试");
    }
  };

  // ✅ 分类
  const publishedCourses = courses.filter((c) => c.isPublished);
  const draftCourses = courses.filter((c) => !c.isPublished);

  // ✅ 渲染单个课程卡片
  const renderCourseCard = (course: any) => (
    <li
      key={course.id}
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "12px",
        borderRadius: "8px",
        background: "#fdfdfd",
      }}
    >
      <h2>{course.title}</h2>
      <p style={{ color: "#666" }}>{course.description}</p>
      <p>状态：{course.isPublished ? "✅ 已发布" : "📝 草稿"}</p>

      <div style={{ marginTop: "8px", display: "flex", gap: "12px" }}>
        <button onClick={() => router.push(`/teacher/dashboard/course/${course.id}`)}>
          ✏️ 编辑
        </button>
        {!course.isPublished ? (
          <button onClick={() => handlePublish(course)}>📢 发布</button>
        ) : (
          <button onClick={() => handleUnpublish(course)}>⛔ 撤销发布</button>
        )}
        <button onClick={() => handleDelete(course.id)}>🗑 删除</button>
      </div>
    </li>
  );

  return (
    <div style={{
      padding: "24px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "system-ui, sans-serif",
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#222",
    }}>
      <h1>📚 我的课程</h1>

      <h2 style={{ marginTop: "24px", fontSize: "20px" }}>📢 已发布课程</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {publishedCourses.length === 0 ? (
          <p style={{ color: "gray" }}>暂无已发布课程</p>
        ) : (
          publishedCourses.map(renderCourseCard)
        )}
      </ul>

      <h2 style={{ marginTop: "24px", fontSize: "20px" }}>📝 草稿课程</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {draftCourses.length === 0 ? (
          <p style={{ color: "gray" }}>暂无草稿课程</p>
        ) : (
          draftCourses.map(renderCourseCard)
        )}
      </ul>
    </div>
  );
}
