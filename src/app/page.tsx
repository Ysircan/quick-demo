'use client';

import Link from "next/link";
import Navbar from "@/components/navbar";
import Background from "@/components/background";

export default function HomePage() {
  return (
    <main className="relative w-full min-h-screen overflow-hidden text-white font-sans">
      <Background />
      <div className="absolute inset-0 z-10">
        <Navbar />

        <section className="mt-36 px-6 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Quick 
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            🚀 打造 AI 驱动的教师助手，一键生成课程任务，学生沉浸式闯关成长。
          </p>

          <p className="text-sm text-gray-400 mb-8">
             “我只是想花更少时间做出更好的任务设计。” —— 来自一位真实老师
          </p>

          <Link
            href="/register
          "
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-semibold text-sm transition duration-300"
          >
            立即开始创建课程 →
            
          </Link>
              <div className="mt-10 text-center">
            <p className="text-sm text-gray-400">
              想亲自体验？现在就开始你的第一套课程创建！
            </p>
          
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            <div className="p-6 bg-white/10 rounded-xl hover:scale-105 transition duration-300">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="text-lg font-semibold mb-1">AI 出题系统</h3>
              <p className="text-sm text-gray-300">上传资料或输入主题，即刻生成精准题目。</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl hover:scale-105 transition duration-300">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-lg font-semibold mb-1">教学任务闭环</h3>
              <p className="text-sm text-gray-300">老师设置任务节奏，学生逐日打卡闯关。</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl hover:scale-105 transition duration-300">
              <div className="text-3xl mb-2">🃏</div>
              <h3 className="text-lg font-semibold mb-1">卡牌成长机制</h3>
              <p className="text-sm text-gray-300">完成任务掉落卡牌，激励学习沉浸成长。</p>
            </div>
          </div>

          {/* 使用流程图 */}
          <div className="mt-20 text-sm text-gray-300">
            <h2 className="text-xl font-semibold mb-4">平台使用流程</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-center">
              <div className="bg-white/5 px-4 py-3 rounded-lg">👩‍🏫 老师上传资料</div>
              <div className="text-purple-400 text-xl">➜</div>
              <div className="bg-white/5 px-4 py-3 rounded-lg">🧠 AI 生成题目</div>
              <div className="text-purple-400 text-xl">➜</div>
              <div className="bg-white/5 px-4 py-3 rounded-lg">🎓 学生领取任务</div>
              <div className="text-purple-400 text-xl">➜</div>
              <div className="bg-white/5 px-4 py-3 rounded-lg">🃏 答题掉落卡牌</div>
            </div>
          </div>

          <div className="mt-16">
            <p className="text-sm text-gray-400">🎓 已有 12 位教师使用 Quick 内测系统</p>
          </div>

          {/* 二次 CTA */}
      
        </section>

        <footer className="text-center text-gray-600 text-xs mt-24 mb-6">
          © 2025 Quick 教育平台 · Powered by QUICK
        </footer>
      </div>
    </main>
  );
}   