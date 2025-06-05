"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentNavbar from "@/components/StudentNavbar";
import { LibraryCourse, LibraryListResponse } from "@/lib/api/student";

export default function StudentLibraryPage() {
  const [courses, setCourses] = useState<LibraryCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("请先登录");
      router.push("/login"); // ✅ 请根据你的实际登录路径修改
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/auth/library", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          alert("登录状态失效，请重新登录");
          router.push("/login");
          return;
        }

        if (res.ok) {
          const data: LibraryListResponse = await res.json();
          setCourses(data.courses || []);
        }
      } catch (err) {
        console.error("获取课程失败", err);
        alert("加载课程出错");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  if (loading) return <div className="p-6 text-white">加载中...</div>;

  if (courses.length === 0) {
    return (
      <>
        <StudentNavbar />
        <div className="p-6 text-white">你还没有加入任何课程，去商店看看吧！</div>
      </>
    );
  }

  return (
    <>
      <StudentNavbar />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-white">
        {courses.map((course) => (
          <div
            key={course.courseId}
            className="bg-[#1f1f1f] rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={course.coverImage || "https://placehold.co/600x200?text=Course+Cover"}
              alt={course.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-bold">{course.title}</h2>
              <p className="text-sm text-gray-400">{course.description}</p>
              <p className="text-sm text-gray-500">进度：{course.progress}%</p>
              <button
                onClick={() => router.push(`/student/store/library/${course.courseId}/unpack`)}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm rounded"
              >
                进入学习
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
