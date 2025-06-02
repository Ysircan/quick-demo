'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  createdAt: string;
  questions?: any[];
  isPublished?: boolean;
}

export default function CourseListPage() {
  const [drafts, setDrafts] = useState<Course[]>([]);
  const [published, setPublished] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/course/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setDrafts(data.drafts || []);
        setPublished(data.published || []);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个草稿吗？")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/auth/course/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setDrafts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleTogglePublish = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/auth/course/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const updated = await res.json();
      const course = updated.course;

      if (course.isPublished) {
        setDrafts((prev) => prev.filter((c) => c.id !== id));
        setPublished((prev) => [course, ...prev]);
      } else {
        setPublished((prev) => prev.filter((c) => c.id !== id));
        setDrafts((prev) => [course, ...prev]);
      }
    }
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">📚 我的课程</h1>

      {/* ✅ 已发布课程 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">✅ 已发布</h2>
        {published.length === 0 ? (
          <p className="text-gray-400">暂无已发布课程。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {published.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onTogglePublish={handleTogglePublish}
              />
            ))}
          </div>
        )}
      </section>

      {/* 📝 草稿课程 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📝 草稿</h2>
        {drafts.length === 0 ? (
          <p className="text-gray-400">暂无草稿课程。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {drafts.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onDelete={handleDelete}
                onTogglePublish={handleTogglePublish}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ✅ 卡片组件：支持删除、发布、撤销
function CourseCard({
  course,
  onDelete,
  onTogglePublish,
}: {
  course: Course;
  onDelete?: (id: string) => void;
  onTogglePublish?: (id: string) => void;
}) {
  return (
    <div className="relative group">
      <Link href={`/teacher/dashboard/course/${course.id}`}>
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow hover:bg-white/10 transition cursor-pointer">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">{course.title}</h2>
          <p className="text-sm text-gray-300">🧠 共 {course.questions?.length || 0} 题</p>
          <p className="text-sm text-gray-400 mt-1">
            🕒 创建于：{new Date(course.createdAt).toLocaleDateString()}
          </p>
        </div>
      </Link>

      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
        {course.isPublished ? (
          <button
            className="px-2 py-1 text-xs bg-yellow-600 rounded hover:bg-yellow-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTogglePublish?.(course.id);
            }}
          >
            撤销发布
          </button>
        ) : (
          <>
            <button
              className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-500"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTogglePublish?.(course.id);
              }}
            >
              发布
            </button>
            <button
              className="px-2 py-1 text-xs bg-red-600 rounded hover:bg-red-500"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(course.id);
              }}
            >
              删除
            </button>
          </>
        )}
      </div>
    </div>
  );
}
