"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "MAIN",
    category: "",
    difficulty: "EASY",
    durationDays: 7,
    price: 0,
    parentId: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/auth/course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    setLoading(false);

    if (result.success) {
      alert("✅ 课程创建成功！");
      const courseId = result.data.id;
      router.push(`/teacher/dashboard/course/${courseId}/generate`);
    } else {
      alert(`❌ 创建失败：${result.error}`);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>🎓 创建新课程</h1>
      <label>课程标题</label>
      <input name="title" value={form.title} onChange={handleChange} style={{ width: "100%" }} />

      <label>课程描述</label>
      <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ width: "100%" }} />

      <label>类型</label>
      <select name="type" value={form.type} onChange={handleChange} style={{ width: "100%" }}>
        <option value="MAIN">主课程</option>
        <option value="PRACTICE">练习课</option>
        <option value="EXAM">考试课</option>
      </select>

      <label>难度</label>
      <select name="difficulty" value={form.difficulty} onChange={handleChange} style={{ width: "100%" }}>
        <option value="EASY">简单</option>
        <option value="MEDIUM">中等</option>
        <option value="HARD">困难</option>
      </select>

      <label>天数</label>
      <input name="durationDays" type="number" value={form.durationDays} onChange={handleChange} style={{ width: "100%" }} />

      <label>价格（¥）</label>
      <input name="price" type="number" value={form.price} onChange={handleChange} style={{ width: "100%" }} />

      <label>父课程ID（可选）</label>
      <input name="parentId" value={form.parentId} onChange={handleChange} style={{ width: "100%" }} />

      <button onClick={handleSubmit} disabled={loading} style={{ marginTop: 16 }}>
        {loading ? "创建中..." : "🚀 创建课程"}
      </button>
    </div>
  );
}
