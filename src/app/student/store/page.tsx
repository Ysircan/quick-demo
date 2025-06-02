'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  createdAt: string;
  questions: any[];
}

export default function StorePage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch('/api/auth/course/public');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">🏪 任务商店</h1>
      {courses.length === 0 ? (
        <p className="text-gray-400">暂无任务，请稍后再来。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white/5 p-6 rounded-xl border border-white/10 shadow hover:bg-white/10 transition">
              <h2 className="text-xl font-semibold text-blue-300 mb-2">{course.title}</h2>
              <p className="text-sm text-gray-300">🧠 共 {course.questions.length} 题</p>
              <p className="text-sm text-gray-400 mt-1">
                🕒 创建于：{new Date(course.createdAt).toLocaleDateString()}
              </p>
              <Link
                href={`/student/task/${course.id}`}
                className="inline-block mt-4 px-4 py-2 text-sm bg-green-600 rounded hover:bg-green-500"
              >
                立即领取
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
