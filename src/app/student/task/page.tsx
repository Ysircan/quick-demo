'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  question: string;
  options?: string[];
  answer: string;
}

interface SavedTask {
  id?: string;
  title?: string;
  questions: Question[];
  schedule?: {
    days: number;
    dailyCount: number;
  };
}

export default function StudentTaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<SavedTask[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedTasks');
    if (!saved) return;

    try {
      const all: SavedTask[] = JSON.parse(saved);
      const withSchedule = all.filter((t) => t.schedule);
      setTasks(withSchedule);
    } catch (err) {
      console.error('❌ 解析任务数据失败:', err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">📘 今日任务列表</h1>

      {tasks.length === 0 ? (
        <p className="text-gray-400">暂无任务，请等待老师布置任务。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task, idx) => {
            const id = task.id || `temp-${idx}`; // fallback ID
            return (
              <div
                key={id}
                className={`bg-gray-800 p-4 rounded shadow ${
                  task.id ? 'hover:bg-gray-700 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                } transition`}
                onClick={() => {
                  if (task.id) {
                    router.push(`/student/task/${task.id}`);
                  } else {
                    alert('⚠️ 该任务无 ID，无法跳转');
                  }
                }}
              >
                <h2 className="text-xl font-semibold">
                  {task.title || `任务 ${idx + 1}`}
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                  总题数：{task.questions.length} 道<br />
                  每日任务：{task.schedule?.dailyCount || '?'} 题 × {task.schedule?.days || '?'} 天
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
