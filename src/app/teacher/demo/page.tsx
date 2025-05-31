'use client';

import { useRef, useState } from 'react';
import QuickLayout from '@/components/layout';
import AIQuestionGenerator from '@/components/ai/AIQuestionGenerator';


export default function DemoPage() {
  const [currentView, setCurrentView] = useState<'initial' | 'main'>('initial');
  const initialRef = useRef<HTMLDivElement>(null);

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
        {/* 你原来的背景粒子层占位 */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />

        {/* 正式内容区域 */}
        <div className="relative z-10 w-full max-w-5xl px-8">
          {currentView === 'initial' && (
            <div
              ref={initialRef}
              className="text-center space-y-6 transition-opacity duration-500"
            >
              <h1 className="text-3xl font-bold animate-pulse">👋 欢迎来到 AI 出题助手</h1>
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
  <div className="py-6">
    <AIQuestionGenerator />
  </div>
)}

        </div>
      </div>
    </QuickLayout>
  );
}
