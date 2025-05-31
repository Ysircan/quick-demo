"use client";

import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import TeacherNavbar from "@/components/navbar";
import QuickLayout from "@/components/layout";


export default function TeacherDashboard() {
  const [isLight, setIsLight] = useState(true);
  const [activePanel, setActivePanel] = useState("courses");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleTheme = () => setIsLight(!isLight);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [teacherName, setTeacherName] = useState("");


  const backgroundColor = isLight ? "bg-yellow-50" : "bg-gray-900";
  const textColor = isLight ? "text-gray-900" : "text-white";


useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTeacherName(data.name || "老师");
      } else {
        console.error("获取用户信息失败");
      }
    } catch (error) {
      console.error("请求错误:", error);
    }
  };

  fetchUser();
}, []);

  return (
     <QuickLayout>
    <div className={`min-h-screen ${backgroundColor} ${textColor} transition-all`}>
    {/* 全局顶部导航栏 */}
    <TeacherNavbar />

    <div className={`min-h-screen flex ${backgroundColor} ${textColor} transition-all`}>
      {/* 左侧可折叠侧边栏 */}
      <div
    
        className={`${
          sidebarOpen ? "w-64" : "w-12"
        } transition-all bg-opacity-20 backdrop-blur border-r border-gray-300 p-4 relative flex flex-col items-start`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-2 p-1 text-sm hover:text-yellow-500"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {sidebarOpen && (
          <div className="space-y-4 mt-10 w-full">
            <button
              className={`w-full text-left font-semibold ${
                activePanel === "courses" ? "underline" : ""
              }`}
              onClick={() => setActivePanel("courses")}
            >
              📚 我的课程
            </button>
            <button
              className={`w-full text-left font-semibold ${
                activePanel === "cards" ? "underline" : ""
              }`}
              onClick={() => setActivePanel("cards")}
            >
              🧩 我的卡片
            </button>
            <button
              className={`w-full text-left font-semibold ${
                activePanel === "students" ? "underline" : ""
              }`}
              onClick={() => setActivePanel("students")}
            >
              👥 学生情况
            </button>
          </div>
        )}
      </div>
      
      {/* 主内容区 */}
      <div className="flex-1 pt-24 px-10 relative">
        {/* 开灯按钮 */}
        <div className="absolute top-4 right-8">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-full border border-gray-400 hover:bg-yellow-200 transition flex items-center gap-2"
          >
            {isLight ? <Sun size={16} /> : <Moon size={16} />}
            {isLight ? "关灯" : "开灯"}
          </button>
        </div>

        {/* 欢迎语 */}
       <h1 className="text-4xl font-extrabold mb-12 text-center">欢迎回来，{teacherName}！</h1>


        {/* 快速操作按钮区域 */}
     <div className="grid grid-cols-2 gap-10 mb-14 max-w-4xl mx-auto">
  <div className="p-8 rounded-2xl shadow bg-white bg-opacity-90 dark:bg-gray-800 hover:shadow-xl cursor-pointer text-center">
    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">➕ 创建新课程</h2>
    <p className="text-gray-700 dark:text-gray-300">
      快速开始发布一门新课程，吸引学生报名。
    </p>
  </div>
  <div className="p-8 rounded-2xl shadow bg-white bg-opacity-90 dark:bg-gray-800 hover:shadow-xl cursor-pointer text-center">
    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">✨ 创建课程卡片</h2>
    <p className="text-gray-700 dark:text-gray-300">
      制作练习用卡片，搭配课程使用。
    </p>
  </div>
        </div>
      </div>
    </div>
    </div>
    </QuickLayout>
  );
}
