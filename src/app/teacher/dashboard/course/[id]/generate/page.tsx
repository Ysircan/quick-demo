'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import QuickLayout from '@/components/layout';
import AIQuestionGenerator from '@/components/ai/AIQuestionGenerator';

export default function CourseGeneratePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [courseTitle, setCourseTitle] = useState<string>(''); // 课程标题
  const [currentView, setCurrentView] = useState<'initial' | 'main'>('initial');
  const initialRef = useRef<HTMLDivElement>(null);

  // 拉取课程标题
  useEffect(() => {
    if (!courseId) return;

    const fetchCourseTitle = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ 未找到 token，可能未登录");
          return;
        }

        const res = await fetch(`/api/auth/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("❌ 获取课程失败", res.status);
          setCourseTitle(`课程（ID: ${courseId}）`);
          return;
        }

        const data = await res.json();
        if (data.success && data.course?.title) {
          setCourseTitle(data.course.title);
        } else {
          setCourseTitle(`课程（ID: ${courseId}）`);
        }
      } catch (error) {
        console.error('❌ 获取课程信息异常', error);
        setCourseTitle(`课程（ID: ${courseId}）`);
      }
    };

    fetchCourseTitle();
  }, [courseId]);

  // 切换视图
  const goNext = () => {
    if (initialRef.current) {
      initialRef.current.classList.add('opacity-0');
    }
    setTimeout(() => {
      setCurrentView('main');
    }, 500);
  };

  return (
    <QuickLayout>
      <div className="fixed inset-0 bg-transparent text-white flex items-center justify-center overflow-hidden">
        {/* 背景层 */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />

        {/* 内容区域 */}
        <div className="relative z-10 w-full max-w-5xl px-8">
          {currentView === 'initial' && (
            <div
              ref={initialRef}
              className="text-center space-y-6 transition-opacity duration-500 opacity-100"
            >
              <h1 className="text-3xl font-bold animate-pulse">👋 欢迎来到 AI 出题助手</h1>
              <p className="text-gray-300">系统将自动关联至当前课程</p>
              <div className="flex justify-center">
                <button
                  onClick={goNext}
                  className="bg-yellow-400 px-6 py-2 rounded-lg text-black font-semibold hover:bg-yellow-500 transition"
                >
                  进入出题页面
                </button>
              </div>
            </div>
          )}

          {currentView === 'main' && (
            <div className="py-6 space-y-4">
              {/* 提示：当前课程 */}
              <div className="bg-yellow-100 text-yellow-900 p-4 rounded-lg shadow text-center font-medium">
                🪧 当前出题绑定课程：<span className="font-bold">{courseTitle}</span>
              </div>

              {/* 出题组件 */}
              <AIQuestionGenerator courseId={courseId} />
            </div>
          )}
        </div>
      </div>
    </QuickLayout>
  );
}
