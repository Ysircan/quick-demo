"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "MAIN",
    difficulty: "EASY",
    durationDays: 30,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "durationDays" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.success && result.data?.id) {
        alert("课程创建成功，ID: " + result.data.id);
        router.push("/teacher/dashboard/course");
      } else {
        setError(result.error || "课程创建失败");
      }
    } catch (err) {
      setError("网络错误或服务器异常");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">📝 创建新课程</h1>

      <div className="space-y-4">
        <input
          name="title"
          placeholder="课程标题"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="课程简介"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="MAIN">主课程</option>
          <option value="PRACTICE">练习课</option>
          <option value="EXAM">考试课</option>
        </select>
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="EASY">简单</option>
          <option value="MEDIUM">中等</option>
          <option value="HARD">困难</option>
        </select>
        <input
          name="durationDays"
          type="number"
          min={1}
          value={formData.durationDays}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "创建中..." : "创建课程"}
        </button>
      </div>
    </div>
  );
}
