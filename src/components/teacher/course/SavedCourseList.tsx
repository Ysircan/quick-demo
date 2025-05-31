'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SavedCourseList() {
  const [savedTasks, setSavedTasks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('savedTasks') || '[]');
    setSavedTasks(stored);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📚 我的课程列表</h2>
      {savedTasks.length === 0 && <p className="text-gray-400">暂无保存课件</p>}
      <div className="space-y-4">
        {savedTasks.map((task, idx) => (
          <div
            key={idx}
            className="p-4 bg-gray-800 text-white rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{task.topic || '未命名任务'}</h3>
              <p className="text-sm text-gray-400">题型：{task.style} | 共 {task.questions?.length || 0} 题</p>
              {task.schedule && (
                <p className="text-green-400 text-sm mt-1">
                  已排课：{task.schedule.totalDays} 天，每天 {task.schedule.questionsPerDay} 题
                </p>
              )}
            </div>
            <button
              className="px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded"
              onClick={() => router.push(`/teacher/saved/${idx}`)}
            >
              管理
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
