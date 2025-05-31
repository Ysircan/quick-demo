"use client";

import { useState } from "react";
import { generatePrompt } from "@/components/ai/promptmethod";
import { PromptParams, QuestionType, Question } from "@/components/ai/type";

const typeMap: Record<QuestionType, string> = {
  choice: "选择题",
  short: "简答题",
  cloze: "填空题"
};

const AiPromptSelector = () => {
  const [topic, setTopic] = useState("热力学");
  const [tempType, setTempType] = useState<QuestionType>("choice");
  const [tempCount, setTempCount] = useState(1);
  const [structure, setStructure] = useState<PromptParams["structure"]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const addStructureItem = () => {
    if (tempCount < 1) return;
    setStructure([...structure, { type: tempType, count: tempCount }]);
    setTempCount(1);
  };

  const removeStructureItem = (index: number) => {
    const updated = [...structure];
    updated.splice(index, 1);
    setStructure(updated);
  };

  const removeQuestionItem = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleGenerate = async () => {
    const prompt = generatePrompt({ topic, structure });
    console.log("🧾 Prompt:", prompt);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: "chatgpt-4o-latest" })
      });

      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("生成失败", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded bg-white text-black max-w-2xl mx-auto">
      <h2 className="text-xl font-bold">🧠 组合式出题 Selector</h2>

      <div className="space-y-2">
        <label className="block font-medium text-blue-700">📘 出题主题</label>
        <input
          className="w-full p-2 border rounded"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-4">
        <select
          value={tempType}
          onChange={(e) => setTempType(e.target.value as QuestionType)}
          className="border p-2 rounded"
        >
          <option value="choice">选择题</option>
          <option value="short">简答题</option>
          <option value="cloze">填空题</option>
        </select>

        <input
          type="number"
          min={1}
          className="w-20 p-2 border rounded"
          value={tempCount}
          onChange={(e) => setTempCount(Number(e.target.value))}
        />

        <button
          onClick={addStructureItem}
          className="bg-purple-100 px-3 py-1 rounded hover:bg-purple-200 text-purple-800 font-semibold"
        >
          ➕ 添加
        </button>
      </div>

      <div className="bg-gray-100 p-3 rounded text-sm">
        <h4 className="font-semibold mb-2">当前结构：</h4>
        {structure.length === 0 ? (
          <p className="text-gray-500">还未添加任何结构</p>
        ) : (
          <ul className="space-y-2">
            {structure.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
              >
                <span>
                  {item.count} 道 {typeMap[item.type]}
                </span>
                <button
                  onClick={() => removeStructureItem(idx)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ❌ 删除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || structure.length === 0}
        className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500 font-semibold"
      >
        {loading ? "生成中..." : "生成题目"}
      </button>

      {questions.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold text-black">🎯 返回题目：</h3>
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm relative"
            >
              {/* 删除按钮右上角浮动 */}
              <button
                onClick={() => removeQuestionItem(idx)}
                className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
              >
                ❌ 删除第 {idx + 1} 题
              </button>

              <p className="font-medium text-black mb-2">
                {idx + 1}. {q.question}
              </p>

              {q.options && Array.isArray(q.options) && (
                <ul className="list-disc list-inside text-gray-700 mb-2">
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              )}

              <p className="text-green-600 text-sm">✅ 答案：{q.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiPromptSelector;
