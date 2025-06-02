"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CoursePage() {
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter();

  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/auth/course?parentOnly=true", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setCourses(result.courses);
      } else {
        console.warn("\u26A0\uFE0F 获取课程失败:", result.error);
      }
    } catch (err) {
      console.error("\u274C 拉取课程失败:", err);
    }
  };

  const fetchSubCourses = async (parentId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/auth/course?parentId=${parentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setCourses(prev => [...prev, ...result.courses]);
      }
    } catch (err) {
      console.error("拉取子课程失败:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const updateCourse = async (course: any, updateData: any) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/auth/course/${course.id}`, {
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

  const handlePublish = (course: any) => updateCourse(course, { isPublished: true });
  const handleUnpublish = (course: any) => updateCourse(course, { isPublished: false });

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除该课程吗？此操作不可撤销！")) return;
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

  const publishedCourses = courses.filter(c => c.isPublished && c.parentId === null);
  const draftCourses = courses.filter(c => !c.isPublished && c.parentId === null);
  const getSubCourses = (parentId: string) => courses.filter(c => c.parentId === parentId);

  const renderSubCourses = (parentId: string) => {
    const subs = getSubCourses(parentId);
    if (!subs.length) return null;
    return (
      <ul style={{ marginLeft: 16, paddingLeft: 12, borderLeft: "2px solid #ddd" }}>
        {subs.map(sub => (
          <li key={sub.id} style={{ marginTop: 6 }}>
            <strong>📎 {sub.title}</strong>（{sub.difficulty}，{sub.durationDays}天）
            <div>
              <button onClick={() => router.push(`/teacher/dashboard/course/${sub.id}`)}>编辑</button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderCourseCard = (course: any) => (
    <li key={course.id} style={{ border: "1px solid #ccc", padding: 16, marginBottom: 12, borderRadius: 8 }}>
      <h2>{course.title} {getSubCourses(course.id).length > 0 && <span style={{ color: "#999", fontSize: 14 }}>（含子课程）</span>}</h2>
      <p>{course.description}</p>
      <p>状态：{course.isPublished ? "✅ 已发布" : "📝 草稿"}</p>
      <p>价格：¥{course.price ?? 0} | 报名人数：{course.enrollment ?? 0}</p>
      <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
        <button onClick={() => router.push(`/teacher/dashboard/course/${course.id}`)}>✏️ 编辑</button>
        {course.isPublished
          ? <button onClick={() => handleUnpublish(course)}>⛔ 撤销发布</button>
          : <button onClick={() => handlePublish(course)}>📢 发布</button>}
        <button onClick={() => handleDelete(course.id)}>🗑 删除</button>
      </div>
      {renderSubCourses(course.id)}
    </li>
  );

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>📚 我的课程</h1>
      <h2 style={{ marginTop: 24 }}>📢 已发布课程</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {publishedCourses.length === 0 ? <p>暂无已发布课程</p> : publishedCourses.map(renderCourseCard)}
      </ul>
      <h2 style={{ marginTop: 24 }}>📝 草稿课程</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {draftCourses.length === 0 ? <p>暂无草稿课程</p> : draftCourses.map(renderCourseCard)}
      </ul>
    </div>
  );
}
