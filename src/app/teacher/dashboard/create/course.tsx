"use client";

import { useEffect } from "react";
import { tsParticles } from "tsparticles-engine";
import { useState } from "react";


export default function CoursePage() {
  useEffect(() => {
    tsParticles.load("tsparticles", {
      fullScreen: { enable: false },
      particles: {
        number: { value: 70 },
        color: { value: ["#60a5fa", "#c084fc", "#facc15"] },
        shape: { type: "circle" },
        opacity: { value: 0.2 },
        size: { value: 2 },
        move: { enable: true, speed: 1, outModes: { default: "bounce" } },
        links: {
          enable: true,
          color: "#facc15",
          distance: 120,
          opacity: 0.25,
          width: 1,
        },
      },
      background: { color: "transparent" },
    });
  }, []);

  const [isLight, setIsLight] = useState(true); // 默认亮色模式


  const handleGoNext = () => {
    document.getElementById("initial")?.classList.remove("show");
    setTimeout(() => {
      document.getElementById("initial")?.classList.add("hidden");
      const split = document.getElementById("split");
      split?.classList.remove("hidden");
      setTimeout(() => {
        split?.classList.add("show");
      }, 50);
    }, 800);
  };

  const handleSave = () => {
    const options = document.getElementById("postSaveOptions");
    options?.classList.remove("hidden");
    setTimeout(() => {
      options?.classList.add("show");
    }, 50);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white flex items-center justify-center p-6 overflow-hidden">
      {/* 粒子背景 */}
      <div id="tsparticles" className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />

      {/* 内容层 */}
      <div className="relative z-10 w-full max-w-7xl">
        {/* 初始欢迎界面 */}
        <div id="initial" className="w-full max-w-3xl text-center space-y-6 fade-in show mx-auto">
       <h1 className={`text-3xl font-bold ${isLight ? 'text-black' : 'text-white'}`}>
  欢迎来到 AI 出题助手
</h1>
          <p className="text-gray-300">请输入课程主题，或上传文件后点击生成题目</p>

<textarea
  placeholder="例如：牛顿三大定律"
  className={`w-full h-24 p-4 rounded-lg border shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 
    ${isLight 
      ? 'bg-white text-black placeholder-black border-gray-400' 
      : 'bg-gray-900 text-white placeholder-white border-gray-600'
    }`}
/>




          <input
            type="file"
            className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-600"
          />

          <div className="flex justify-center">
            <button
              onClick={handleGoNext}
              className="mt-4 bg-yellow-400 px-6 py-2 rounded-lg text-black font-semibold hover:bg-yellow-500 transition"
            >
              开始生成题目
            </button>
          </div>
        </div>

        {/* 分屏主界面 */}
        <div id="split" className="hidden w-full min-h-[70vh] grid grid-cols-2 gap-6 fade-in mt-10">
          {/* 左侧 */}
          <div className="flex flex-col space-y-4 p-6">
            <div className="bg-gray-800 p-4 rounded-lg min-h-[300px] overflow-y-auto">
              <p className="text-sm text-gray-300 mb-2">🤖 AI: What's the topic of your course?</p>
              <p className="text-sm text-gray-300">🤖 AI: I'll generate questions based on it.</p>
            </div>

            <textarea
              placeholder="再次输入主题..."
              className="w-full h-24 p-3 rounded-lg border border-gray-400 bg-white text-gray-900 placeholder-gray-500 shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600"
            />

            <input
              type="file"
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-600"
            />

            <button className="bg-yellow-400 py-2 px-4 rounded-lg text-black font-semibold hover:bg-yellow-500">
              生成题目
            </button>
          </div>

          {/* 右侧 */}
          <div className="flex flex-col space-y-4 p-6">
            <div className="bg-gray-800 p-4 rounded-lg min-h-[300px] overflow-y-auto">
              <h2 className="text-lg font-bold mb-2 text-white">题目预览</h2>
              <ul className="text-gray-300 list-disc list-inside">
                <li>What is Newton’s first law?</li>
                <li>Choose the correct formula for force.</li>
              </ul>
            </div>

            <button
              onClick={handleSave}
              className="bg-green-500 py-2 px-4 rounded-lg font-semibold text-black hover:bg-green-600"
            >
              保存至我的课程
            </button>

            <div id="postSaveOptions" className="bg-gray-700 rounded-lg p-4 space-y-2 hidden fade-in">
              <button className="w-full bg-gray-800 p-2 rounded hover:bg-gray-600">➕ 添加卡片？</button>
              <button className="w-full bg-gray-800 p-2 rounded hover:bg-gray-600">➕ 继续新建？</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-in-out;
        }
        .fade-in.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
