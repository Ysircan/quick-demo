'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SchedulePage() {
  const { id } = useParams();
  const router = useRouter();

  const [task, setTask] = useState<any>(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const stored = localStorage.getItem('savedTasks');
    if (!stored) return;

    const allTasks = JSON.parse(stored);
    const current = allTasks[Number(id)];
    if (current) setTask(current);
  }, [id]);

  const handleSchedule = () => {
    const stored = JSON.parse(localStorage.getItem('savedTasks') || '[]');
    const updated = [...stored];
    const target = updated[Number(id)];

    target.schedule = {
      totalDays: days,
      questionsPerDay: Math.ceil(target.questions.length / days),
      startDate: new Date().toISOString()
    };

    localStorage.setItem('savedTasks', JSON.stringify(updated));
    alert('✅ 排课设置成功！');
    router.push('/teacher/dashboard');
  };

  if (!task) return <p className="p-6 text-white">加载中...</p>;

  return (
    <div className="p-8 text-white max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📅 排课设置：「{task.topic}」</h1>
      <p className="mb-4 text-gray-300">题目总数：{task.questions.length}</p>

      <label className="block mb-2">请输入课程持续天数：</label>
      <input
        type="number"
        min={1}
        className="p-2 bg-gray-800 rounded w-32 mb-4"
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
      />

      <p className="mb-6">
        系统将平均分配为：<strong>{Math.ceil(task.questions.length / days)}</strong> 题 / 天
      </p>

      <button
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded"
        onClick={handleSchedule}
      >
        ✅ 确认并保存排课设置
      </button>
    </div>
  );
}
