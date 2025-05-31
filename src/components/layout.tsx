"use client";

import Background from "@/components/background";
import NavBar from "@/components/navbar"; // 注意大小写

export default function QuickLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-sky-900 text-white transition-all duration-700">
      
      {/* ✅ 粒子背景层 */}
      <Background />

      {/* ✅ 光晕背景 */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] 
          transform -translate-x-1/2 -translate-y-1/2 blur-3xl 
          bg-[radial-gradient(circle,rgba(202,138,255,0.25),transparent_70%)]">
        </div>
      </div>

      {/* ✅ 导航栏 */}
      <NavBar />

      {/* ✅ 主内容层 */}
      <div className="relative z-10 px-6 pt-24 pb-8">
        <main>{children}</main>
      </div>
    </div>
  );
}
