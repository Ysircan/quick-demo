'use client';

import { useState } from 'react';
import {
  Question,
  QuestionStructure,
  PromptParams,
  QuestionType,
} from './type';
import { generatePrompt } from './promptmethod';

const QUESTION_TYPES: { label: string; value: QuestionType }[] = [
  { label: '选择题', value: 'choice' },
  { label: '简答题', value: 'short' },
  { label: '填空题', value: 'cloze' },
];

const TYPE_MAP: Record<QuestionType, string> = {
  choice: '选择题',
  short: '简答题',
  cloze: '填空题',
};

const STYLES = ['高考', '中考', '法考', 'PTE', '雅思'];

export default function AIQuestionGenerator() {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('');
  const [structure, setStructure] = useState<QuestionStructure[]>([]);
  const [questions, setQuestions] = useState<(Question & { selected?: boolean })[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedType, setSelectedType] = useState<QuestionType>('choice');
  const [count, setCount] = useState<number>(1);

  const addStructure = (type: QuestionType, count: number) => {
    if (count < 1) return;
    setStructure((prev) => [...prev, { type, count }]);
  };

  const removeStructure = (index: number) => {
    setStructure((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSelect = (index: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, selected: !q.selected } : q))
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!topic || structure.length === 0) {
      return alert('请输入主题并至少添加一个题型数量');
    }

    const titleInput = window.prompt('请输入本次作业的标题', '未命名作业');
    if (!titleInput) return;
    setTitle(titleInput);

    const params: PromptParams = { topic, structure, style };
    const prompt = generatePrompt(params);

    setLoading(true);
    try {
      const res = await fetch('/api/ai/generateWithPrompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      let result = Array.isArray(data) ? data : data.result;

      if (typeof result === 'string') {
        try {
          result = JSON.parse(result);
        } catch (e) {
          console.error('解析失败', result);
        }
      }

      if (Array.isArray(result)) {
        setQuestions(result.map((q) => ({ ...q, selected: false })));
      } else {
        alert('返回格式无法识别');
      }
    } catch (err) {
      console.error(err);
      alert('生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const selected = questions.filter((q) => q.selected);
    if (!selected.length) return alert('请至少选择一道题目进行保存');

    const newTask = {
      id: Date.now().toString(),  // ✅ 自动生成唯一 id
      topic: title,
      style,
      questions: selected,
      structure,
      timestamp: Date.now(),
    };

    const existing = JSON.parse(localStorage.getItem('savedTasks') || '[]');
    localStorage.setItem('savedTasks', JSON.stringify([...existing, newTask]));
    alert('✅ 课程已保存！');
  };

  return (
    <div className="flex flex-col md:flex-row bg-white text-black p-6 rounded shadow max-w-6xl mx-auto space-y-6 md:space-y-0 md:space-x-6">
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-bold">AI 出题生成器</h2>

        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded"
          placeholder="请输入出题主题，如：光合作用"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <div className="flex items-center space-x-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as QuestionType)}
            className="border p-2 rounded"
          >
            {QUESTION_TYPES.map((qt) => (
              <option key={qt.value} value={qt.value}>
                {qt.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 p-2 border rounded"
          />

          <button
            onClick={() => addStructure(selectedType, count)}
            className="bg-blue-100 px-4 py-1 rounded hover:bg-blue-200"
          >
            + 添加结构
          </button>
        </div>

        <div>
          <label className="block mt-2 font-medium">选择出题风格：</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option value="">-- 可选 --</option>
            {STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {structure.length > 0 && (
          <div className="text-sm text-gray-700 space-y-2">
            <p>当前结构：</p>
            {structure.map((s, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span>{s.count} 道 {TYPE_MAP[s.type]}</span>
                <button
                  className="text-red-500 text-xs"
                  onClick={() => removeStructure(i)}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? '生成中...' : '生成题目'}
        </button>
      </div>

      {/* 右侧：题目预览区 */}
      <div className="flex-1 max-h-[80vh] overflow-y-auto bg-gray-50 p-4 rounded shadow-inner">
        {questions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {questions.map((q, i) => (
              <div
                key={i}
                className="relative border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
              >
                <p className="font-semibold text-lg text-gray-800">
                  {i + 1}. {q.question}
                </p>

                {Array.isArray(q.options) && q.options.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {q.options.map((opt, idx) => (
                      <li
                        key={idx}
                        className={`px-3 py-2 border rounded ${
                          opt === q.answer
                            ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}. {opt}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-blue-700">
                    ✅ <span className="font-medium">参考答案：</span> {q.answer}
                  </p>
                )}

                {/* ✅ 保存单题 */}
                <button
                  className={`absolute top-2 right-20 text-xs ${q.selected ? 'text-green-600' : 'text-blue-500'} hover:underline`}
                  onClick={() => toggleSelect(i)}
                >
                  {q.selected ? '✅ 已选择' : '💾 保存该题'}
                </button>

                {/* 删除 */}
                <button
                  className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
                  onClick={() => removeQuestion(i)}
                >
                  删除题目
                </button>
              </div>
            ))}

            {/* 保存按钮 */}
            <div className="w-full mt-4 text-center">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white"
              >
                📦 保存选中题目为课程
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center">暂无生成内容，请先输入主题并生成题目。</p>
        )}
      </div>
    </div>
  );
}
