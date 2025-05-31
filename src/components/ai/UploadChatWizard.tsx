"use client";

import { useState } from "react";

interface UploadChatWizardProps {
  uploadedText: string;
  onGenerate: (questions: any[]) => void;
}

export default function UploadChatWizard({ uploadedText, onGenerate }: UploadChatWizardProps) {
  const [input, setInput] = useState("");

  const handleGenerate = async () => {
    const structure = parseStructureFromInput(input);
    const topic = "自动识别";
    const style = "";

    const res = await fetch("/api/ai/generateWithPrompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        inputText: uploadedText,
        structure,
        style
      })
    });

    const data = await res.json();
    if (Array.isArray(data)) {
      onGenerate(data);
    } else {
      alert("❌ AI 返回格式错误");
    }
  };

  // 简单关键词解析：选择题、填空题、简答题
  const parseStructureFromInput = (text: string) => {
    const s = [];
    if (text.includes("选择题")) s.push({ type: "choice", count: 5 });
    if (text.includes("填空题")) s.push({ type: "cloze", count: 3 });
    if (text.includes("简答题")) s.push({ type: "short", count: 2 });
    if (s.length === 0) s.push({ type: "choice", count: 3 });
    return s;
  };

  return (
    <div>
      <p className="mb-2 text-black font-semibold">🤖 我已读取您的资料，请告诉我想出什么题目：</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border p-2 rounded text-black mb-3"
        placeholder="例如：出5道选择题和2道填空题"
      />
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        生成题目
      </button>
    </div>
  );
}
