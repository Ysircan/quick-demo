"use client";

import { useState, useRef, useEffect } from "react";
import QuickLayout from "@/components/layout";
import QuestionStructureBuilder from "@/components/ai/QuestionStructureBuilder";
import { QuestionStructure } from "@/components/ai/type";
import { generatePromptForUpload } from "@/components/ai/generatePromptForUpload";
import { generatePrompt } from "@/components/ai/promptmethod";
import UploadChatWizard from "@/components/ai/UploadChatWizard";



import mammoth from "mammoth";
import * as XLSX from "xlsx";

interface Question {
  id?: string;
  question: string;
  options?: string[];
  answer?: string;
}

export default function AIQuestionGenerator() {
  const [currentView, setCurrentView] = useState<'initial' | 'split'>('initial');
  const [inputText, setInputText] = useState('');
  const [uploadedText, setUploadedText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [structure, setStructure] = useState<QuestionStructure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'upload' | 'manual'>('chat');
  const [editSuggestions, setEditSuggestions] = useState<string[]>([]);
  const [style, setStyle] = useState("");
  const [filePrompt, setFilePrompt] = useState("");
  const [showUploadChat, setShowUploadChat] = useState(false);



  const initialRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && particlesRef.current && (window as any).tsParticles) {
      (window as any).tsParticles.load("tsparticles", {
        fullScreen: { enable: false },
        particles: {
          number: { value: 70 },
          color: { value: ["#60a5fa", "#c084fc", "#facc15"] },
          shape: { type: "circle" },
          opacity: { value: 0.2 },
          size: { value: 2 },
          move: { enable: true, speed: 1, outModes: { default: "bounce" } },
          links: {
            enable: true, color: "#facc15", distance: 120, opacity: 0.25, width: 1
          }
        },
        background: { color: "transparent" }
      });
    }
  }, []);

  const goNext = () => {
    if (initialRef.current && splitRef.current) {
      initialRef.current.classList.add("fade-out");
      setTimeout(() => {
        setCurrentView("split");
      }, 500);
    } else {
      setCurrentView("split");
    }
  };

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const ext = file.name.split(".").pop()?.toLowerCase();

  try {
    if (ext === "txt") {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setUploadedText(text); // ✅ 只保存到 uploadedText，不污染 inputText
           setInputText(text); // ✅ 新增：同步赋值
           setShowUploadChat(true);

      };
      reader.readAsText(file);
    } else if (ext === "docx") {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      setUploadedText(text);
        setInputText(text); // ✅ 新增：同步赋值
        setShowUploadChat(true);

    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const text = XLSX.utils.sheet_to_csv(sheet);
        setUploadedText(text);
         setInputText(text); // ✅ 新增：同步赋值
         setShowUploadChat(true);

      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("暂不支持该文件类型，请上传 txt / docx / xlsx。");
    }
  } catch (err) {
    console.error("读取文件失败", err);
    alert("无法读取文件内容，请检查格式或重新上传。");
  }
};


 const generateQuestions = async () => {
  console.log("📄 当前 inputText：", inputText);

  try {
    setIsLoading(true);

    let res;

    if (mode === "upload") {
      // 📁 上传文件模式：调用 generateWithPrompt（使用的是上传内容）
      const prompt = generatePrompt({
        topic: "",
        inputText, // 上传后的文本也存在 inputText 中
        structure,
        style
      });

     res = await fetch("/api/ai/generateWithPrompt", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt }) // ✅
});
    } else {
      // 💬 聊天模式：调用 generate（使用结构生成题目）
      const prompt = generatePrompt({
        topic: "",
        inputText,
        structure,
        style
      });

      res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: "", inputText, structure, style })
      });
    }
const data = await res.json();
console.log("AI 返回数据：", data);

if (Array.isArray(data)) {
  setQuestions(data); // ✅ 安全处理，确保是数组
} else {
  console.warn("❌ AI 返回不是数组：", data);
  setQuestions([]);
}

  } catch (err) {
    console.error("❌ 生成失败：", err);
  } finally {
    setIsLoading(false);
  }
};


  const handleEdit = async (index: number, suggestion: string) => {
    const original = questions[index];
    try {
      const res = await fetch("/api/ai/edit-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: original, suggestion })
      });

      if (!res.ok) {
        alert("修改失败，请检查内容或稍后重试。");
        return;
      }

      const updated = await res.json();
      if (!updated || !updated.question) {
        alert("AI 返回内容有误。");
        return;
      }

      const newList = [...questions];
      newList[index] = updated;
      setQuestions(newList);
    } catch (err) {
      alert("修改失败，请稍后重试。");
    }
  };

  const fileInputClass = `mt-2 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 
    file:rounded-full file:border-0 file:text-sm file:font-semibold 
    file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100`;

  return (
    <QuickLayout>
      <div className="fixed inset-0 bg-transparent text-white flex items-center justify-center overflow-hidden">
        <div id="tsparticles" ref={particlesRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />
        <div className="relative z-10 w-full max-w-7xl px-8">
          {currentView === 'initial' && (
            <div ref={initialRef} className="text-center space-y-6 transition-opacity duration-500">
              <h1 className="text-3xl font-bold animate-pulse">👋 欢迎来到 AI 出题助手</h1>
              <div className="flex justify-center">
                <button
                  onClick={goNext}
                  className="bg-yellow-400 px-6 py-2 rounded-lg text-black font-semibold hover:bg-yellow-500 transition"
                >
                  进入出题页面
                </button>
              </div>
            </div>
          )}

          {currentView === 'split' && (
            <div ref={splitRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 fade-in">
              <div className="flex flex-col space-y-6 min-h-[500px]">
                <div className="bg-white rounded-xl p-4 text-black shadow space-y-4">
                  <div className="flex space-x-4">
                    <button onClick={() => setMode("chat")} className={`px-4 py-2 rounded-full text-sm font-semibold border ${mode === "chat" ? "bg-yellow-400 text-black" : "bg-white text-gray-700 hover:bg-yellow-50"}`}>🤖 聊天出题</button>
                    <button onClick={() => setMode("upload")} className={`px-4 py-2 rounded-full text-sm font-semibold border ${mode === "upload" ? "bg-yellow-400 text-black" : "bg-white text-gray-700 hover:bg-yellow-50"}`}>📄 上传文件</button>
                    <button disabled className="px-4 py-2 rounded-full text-sm font-semibold border bg-gray-300 text-gray-500 cursor-not-allowed">✍️ 自有题目（开发中）</button>
                  </div>

                  {mode === 'chat' && (
                    <textarea className="w-full h-24 p-3 rounded border border-gray-300" placeholder="输入对话内容..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
                  )}

                {mode === 'upload' && (
  <>
    <input type="file" className={fileInputClass} onChange={handleFileUpload} />

    <label className="block text-sm font-medium text-gray-700 mt-4">出题目的</label>
    <select
      value={filePrompt}
      onChange={(e) => setFilePrompt(e.target.value)}
      className="w-full mt-1 p-2 border border-gray-300 rounded"
    >
      <option value="">请自动判断</option>
      <option value="Design high school-style multiple choice questions">高考选择题</option>
      <option value="Create comprehension questions for legal exam">法考阅读题</option>
      <option value="Generate IB-level short answer questions">IB 简答题</option>
      <option value="Design general review questions for junior high students">中考总复习题</option>
    </select>
  </>
)}

<div>
  <label className="block text-sm font-medium text-gray-700 mt-4">题目风格</label>
  <select
    value={style}
    onChange={(e) => setStyle(e.target.value)}
    className="w-full mt-1 p-2 border border-gray-300 rounded"
  >
    <option value="">默认风格</option>
    <option value="VCE">VCE 考试风格</option>
    <option value="IB">IB 国际课程风格</option>
    <option value="Gaokao">高考风格</option>
    <option value="fun">趣味引导风格</option>
    <option value="academic">术语严谨风格</option>
  </select>
</div>

                </div>

                <QuestionStructureBuilder structure={structure} onChange={setStructure} />

                <button onClick={generateQuestions} disabled={isLoading} className={`py-2 px-4 rounded-lg text-black font-semibold ${isLoading ? 'bg-yellow-200' : 'bg-yellow-400 hover:bg-yellow-500'}`}>
                  {isLoading ? '生成中...' : '生成题目'}
                </button>
              </div>

              <div className="flex flex-col space-y-4 min-h-[600px]">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg overflow-y-auto max-h-[500px]">
                  <h2 className="text-xl font-bold mb-4 text-white">📘 题目预览</h2>
                  {questions.length === 0 ? (
                    <p className="text-gray-400 italic">暂无题目，请先生成</p>
                  ) : (
                    <ul className="text-gray-100 list-decimal list-inside space-y-4 leading-relaxed">
                      {questions.map((q, idx) => (
                        <li key={q.id || idx} className="relative pr-10">
                          <div className="space-y-2 bg-gray-700 p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                              <p className="font-medium">{q.question || "（无题干）"}</p>
                              <button onClick={() => {
                                const updated = [...questions];
                                updated.splice(idx, 1);
                                setQuestions(updated);
                              }} className="text-red-400 text-sm hover:text-red-600">❌</button>
                            </div>
                            {Array.isArray(q.options) && q.options.length > 0 && (
                              <ul className="ml-4 list-disc text-sm text-gray-300 space-y-1">
                                {q.options.map((opt, i) => (
                                  <li key={i}>{opt}</li>
                                ))}
                              </ul>
                            )}
                            {q.answer && (
                              <div className="mt-3 p-3 bg-gray-900 text-green-300 rounded">
                                <p className="font-semibold mb-1">✅ 参考答案：</p>
                                <p>{q.answer}</p>
                              </div>
                            )}
                            <div className="mt-3">
                              <textarea className="w-full text-sm p-2 rounded border border-gray-500 text-black" placeholder="✏️ 输入修改建议，如“换成填空题”" value={editSuggestions[idx] || ''} onChange={(e) => {
                                const copy = [...editSuggestions];
                                copy[idx] = e.target.value;
                                setEditSuggestions(copy);
                              }} />
                              <button className="mt-1 px-3 py-1 bg-yellow-400 text-black text-xs rounded hover:bg-yellow-500" onClick={() => handleEdit(idx, editSuggestions[idx])}>提交修改</button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .fade-out {
          opacity: 0;
          transition: opacity 0.5s ease-out;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {showUploadChat && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg w-[600px] max-w-full p-6">
      <UploadChatWizard
        uploadedText={uploadedText}
        onGenerate={(qs) => {
          setQuestions(qs);
          setShowUploadChat(false);
        }}
      />
    </div>
  </div>
)}


    </QuickLayout>
  );
}
