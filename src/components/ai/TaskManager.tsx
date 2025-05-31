// components/TaskManager.tsx
'use client';

import { useState } from 'react';

export default function TaskManager({ questions }: { questions: any[] }) {
  const [taskName, setTaskName] = useState('');
  const [savedTasks, setSavedTasks] = useState<any[]>([]);

  const handleSave = () => {
    if (!taskName || questions.length === 0) {
      alert('请填写任务名并生成题目');
      return;
    }
    const newTask = { name: taskName, questions };
    setSavedTasks((prev) => [...prev, newTask]);
    setTaskName('');
    alert('任务保存成功！');
  };

  return (
    <div className="bg-white p-6 rounded shadow text-gray-900">
      <h2 className="text-lg font-semibold mb-4">2️⃣ 安排任务</h2>

      <input
        className="w-full border border-gray-300 p-2 mb-4 rounded"
        placeholder="任务名称（如 第1课练习）"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />

      <button
        onClick={handleSave}
        disabled={!taskName || questions.length === 0}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        保存任务
      </button>

      {savedTasks.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">📚 已保存任务</h3>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            {savedTasks.map((task, idx) => (
              <li key={idx}>
                <strong>{task.name}</strong> - 共 {task.questions.length} 题
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
