'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Question {
  question: string;
  options?: string[];
  answer: string;
}

interface SavedTask {
  id: string;
  title: string;
  questions: Question[];
  schedule?: {
    days: number;
    dailyCount: number;
  };
}

export default function StudentTaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [task, setTask] = useState<SavedTask | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('savedTasks');
    if (!saved || !id) return;

    const all: SavedTask[] = JSON.parse(saved);
    const match = all.find((t) => t.id === id);

    if (match && match.schedule) {
      setTask(match);
    } else {
      alert('未找到该任务或任务未排课');
      router.push('/student/task');
    }
  }, [id]);

  if (!task) return <div className="p-6 text-white">加载中...</div>;

  const todayQuestions = task.questions.slice(0, task.schedule!.dailyCount);
  const currentQuestion = todayQuestions[currentIndex];

  const handleSelect = (opt: string) => {
    setSelected(opt);
    setShowAnswer(true);
  };

  const next = () => {
    setSelected(null);
    setShowAnswer(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">{task.title} - 今日任务</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <p className="text-lg font-medium mb-4">
          第 {currentIndex + 1} / {todayQuestions.length} 题
        </p>

        <p className="text-xl font-semibold mb-6">{currentQuestion.question}</p>

        {currentQuestion.options?.map((opt, idx) => {
          const isCorrect = opt === currentQuestion.answer;
          const isSelected = selected === opt;

          let bg = 'bg-gray-700';
          if (showAnswer && isSelected && isCorrect) bg = 'bg-green-600';
          else if (showAnswer && isSelected && !isCorrect) bg = 'bg-red-600';
          else if (showAnswer && isCorrect) bg = 'bg-green-700';

          return (
            <button
              key={idx}
              disabled={showAnswer}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left p-3 mb-2 rounded ${bg} hover:bg-gray-600 transition`}
            >
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          );
        })}

        {showAnswer && (
          <div className="mt-4 flex justify-between items-center">
            <p>
              正确答案：<span className="font-bold text-green-400">{currentQuestion.answer}</span>
            </p>
            {currentIndex + 1 < todayQuestions.length ? (
              <button
                onClick={next}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                下一题 →
              </button>
            ) : (
              <button
                onClick={() => router.push('/student/task')}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                ✅ 完成任务
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
