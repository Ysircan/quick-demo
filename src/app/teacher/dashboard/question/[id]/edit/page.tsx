"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditQuestionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔁 加载题目数据
  useEffect(() => {
    const fetchQuestion = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/auth/question/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok && result.question) {
        setQuestion({
          ...result.question,
          options: result.question.options || [],
        });
      } else {
        setError(result.error || "无法加载题目");
      }
    };

    if (id) fetchQuestion();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setQuestion((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOptionsChange = (index: number, value: string) => {
    const updatedOptions = [...question.options];
    updatedOptions[index] = value;
    setQuestion({ ...question, options: updatedOptions });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/auth/question/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(question),
    });

    const result = await res.json();
    if (res.ok && result.success) {
      router.back();
    } else {
      setError(result.error || "保存失败");
    }
    setLoading(false);
  };

  if (!question) return <div style={{ padding: 24 }}>加载中...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <h2>✏️ 编辑题目</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>题干：</label>
      <textarea
        name="content"
        value={question.content}
        onChange={handleChange}
        style={{ width: "100%" }}
      />

      <label>类型：</label>
      <select
        name="type"
        value={question.type}
        onChange={handleChange}
        style={{ width: "100%" }}
      >
        <option value="choice">选择题</option>
        <option value="cloze">填空题</option>
        <option value="short">简答题</option>
      </select>

      {/* ✅ 仅在选择题时显示选项编辑 */}
      {question.type === "choice" && (
        <>
          <label>选项：</label>
          {question.options?.map?.((opt: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
              <input
                value={opt}
                onChange={(e) => handleOptionsChange(i, e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() =>
                  setQuestion((prev: any) => ({
                    ...prev,
                    options: prev.options.filter((_: string, idx: number) => idx !== i),
                  }))
                }
              >
                ❌
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setQuestion((prev: any) => ({
                ...prev,
                options: [...prev.options, ""],
              }))
            }
            style={{ marginTop: 8 }}
          >
            ➕ 添加选项
          </button>
        </>
      )}

      <label>答案：</label>
      <input
        name="answer"
        value={question.answer}
        onChange={handleChange}
        style={{ width: "100%" }}
      />

      <label>解释：</label>
      <textarea
        name="explanation"
        value={question.explanation || ""}
        onChange={handleChange}
        style={{ width: "100%" }}
      />

      <label>难度：</label>
      <select
        name="difficulty"
        value={question.difficulty || "MEDIUM"}
        onChange={handleChange}
        style={{ width: "100%" }}
      >
        <option value="EASY">简单</option>
        <option value="MEDIUM">中等</option>
        <option value="HARD">困难</option>
      </select>

      <label>分值：</label>
      <input
        name="score"
        type="number"
        value={question.score}
        onChange={handleChange}
        style={{ width: "100%" }}
      />

      <label style={{ display: "block", marginTop: 10 }}>
        <input
          type="checkbox"
          name="allowRepeat"
          checked={question.allowRepeat}
          onChange={handleChange}
        />
        允许重复答题
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        {loading ? "保存中..." : "💾 保存修改"}
      </button>
    </div>
  );
}
