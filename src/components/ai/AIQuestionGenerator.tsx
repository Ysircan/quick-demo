'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ 添加 router

type QuestionType = 'choice' | 'short' | 'cloze';
interface QuestionStructure { type: QuestionType; count: number }
interface AIQuestion {
  type: QuestionType;
  content: string;
  options?: string[];
  answer: string;
  explanation?: string;
  selected?: boolean;
}

interface AIQuestionGeneratorProps {
  courseId: string;
}

const QUESTION_TYPES = [
  { label: '选择题', value: 'choice' },
  { label: '简答题', value: 'short' },
  { label: '填空题', value: 'cloze' },
];

const STYLES = ['高考', '中考', '法考', 'PTE', '雅思'];

export default function AIQuestionGenerator({ courseId }: AIQuestionGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('');
  const [structure, setStructure] = useState<QuestionStructure[]>([]);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<QuestionType>('choice');
  const [count, setCount] = useState<number>(1);
  const router = useRouter(); // ✅ 初始化 router

  const addStructure = () => {
    if (count < 1) return;
    setStructure((prev) => [...prev, { type: selectedType, count }]);
  };

  const removeStructure = (index: number) => {
    setStructure((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!topic || structure.length === 0) return alert('请填写主题和题型结构');

    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, structure, style }),
      });

      const data = await res.json();
      if (data?.questions?.length) {
        setQuestions(data.questions.map((q: AIQuestion) => ({ ...q, selected: false })));
      } else {
        alert('题目生成失败，请检查结构');
      }
    } catch (err) {
      console.error(err);
      alert('接口错误');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (i: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === i ? { ...q, selected: !q.selected } : q))
    );
  };

  const removeQuestion = (i: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    const selected = questions.filter((q) => q.selected);
    if (!selected.length) return alert('请至少选择一道题');

    const token = localStorage.getItem('token');
    if (!token) return alert('请先登录');

    try {
      const res = await fetch('/api/auth/question/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId, questions: selected }),
      });

      if (res.ok) {
        alert('✅ 题目保存成功，正在返回课程页...');
        router.push(`/teacher/dashboard/course/${courseId}`); // ✅ 自动跳转
      } else {
        alert('❌ 保存失败，请检查后端或课程ID');
      }
    } catch (err) {
      console.error(err);
      alert('❌ 系统错误');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-gray-900 text-white rounded-lg shadow">
      <h2 className="text-xl font-bold">AI 出题生成器</h2>

      <input
        className="w-full border border-gray-600 bg-gray-800 p-2 rounded text-white"
        placeholder="请输入出题主题"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <div className="flex space-x-2">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as QuestionType)}
          className="border border-gray-600 bg-gray-800 text-white p-2 rounded"
        >
          {QUESTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-20 border border-gray-600 bg-gray-800 text-white p-2 rounded"
        />

        <button
          onClick={addStructure}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + 添加结构
        </button>
      </div>

      <div className="space-y-1 text-sm">
        {structure.map((s, i) => (
          <div key={i} className="flex justify-between text-gray-300">
            <span>{s.count} 道 {QUESTION_TYPES.find((t) => t.value === s.type)?.label}</span>
            <button onClick={() => removeStructure(i)} className="text-red-400 hover:text-red-600 text-xs">
              删除
            </button>
          </div>
        ))}
      </div>

      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"
      >
        <option value="">-- 选择风格（可选） --</option>
        {STYLES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        {loading ? '生成中...' : '生成题目'}
      </button>

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="border border-gray-600 rounded p-4 bg-gray-800 relative">
              <p className="font-semibold text-gray-100">{i + 1}. {q.content}</p>

              {q.options ? (
                <ul className="mt-2 space-y-1 text-sm text-gray-200">
                  {q.options.map((opt, idx) => (
                    <li
                      key={idx}
                      className={`px-3 py-1 border rounded ${opt === q.answer
                        ? 'border-green-400 bg-green-700 text-white font-medium'
                        : 'border-gray-600'}`}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-blue-300 mt-2 text-sm">答案：{q.answer}</p>
              )}

              <button
                className={`absolute top-2 right-24 px-2 py-1 text-xs rounded ${q.selected
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                onClick={() => toggleSelect(i)}
              >
                {q.selected ? '✅ 已选择' : '💾 保存该题'}
              </button>

              <button
                onClick={() => removeQuestion(i)}
                className="absolute top-2 right-4 text-xs text-red-400 hover:text-red-600"
              >
                删除
              </button>
            </div>
          ))}

          <div className="text-center mt-4">
            <button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
            >
              📦 保存选中题目
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
