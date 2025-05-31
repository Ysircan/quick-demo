"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Register.module.css";


export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, name}),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "注册失败，请重试");
        return;
      }

      router.push("/login");
    } catch {
      setError("请求异常，请稍后再试");
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-gradient-to-tr from-yellow-200 via-white to-yellow-100">
      
      {/* 顶部导航栏 */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-4 bg-black bg-opacity-60 z-20">
        <div className="text-yellow-200 text-xl font-bold">Quick</div>
        <ul className="flex space-x-6 text-sm text-white">
          <li><a href="/" className="hover:text-yellow-300">首页</a></li>
          <li><a href="#" className="hover:text-yellow-300">探索</a></li>
          <li><a href="#" className="hover:text-yellow-300">功能</a></li>
          <li><a href="/login" className="hover:text-yellow-300">登录</a></li>
        </ul>
      </div>

      {/* 注册表单卡片 */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white bg-opacity-95 p-10 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
          注册 Quick 教育系统
        </h2>

        {/* 角色切换 */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`px-5 py-2 rounded font-medium transition ${
              role === "STUDENT"
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            学生注册
          </button>
          <button
            type="button"
            onClick={() => setRole("TEACHER")}
            className={`px-5 py-2 rounded font-medium transition ${
              role === "TEACHER"
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            老师注册
          </button>
        </div>

        {/* 名字 */}
<label htmlFor="name" className="block mb-2 text-gray-700 font-medium">
  姓名
</label>
<input
  id="name"
  type="text"
  className="w-full border border-gray-300 p-3 rounded-md mb-6 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="请输入您的姓名"
  required
/>
        {/* 邮箱 */}
        <label htmlFor="email" className="block mb-2 text-gray-700 font-medium">
          邮箱
        </label>
        <input
          id="email"
          type="email"
          className="w-full border border-gray-300 p-3 rounded-md mb-6 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="请输入邮箱"
          required
        />

        {/* 密码 */}
        <label htmlFor="password" className="block mb-2 text-gray-700 font-medium">
          密码
        </label>
        <input
          id="password"
          type="password"
          className="w-full border border-gray-300 p-3 rounded-md mb-6 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
          required
        />

        {role === "TEACHER" && (
          <p className="mb-4 text-sm text-gray-500">
            教师注册将进入审核流程，提交后请耐心等待。
          </p>
        )}

        {error && (
          <p className="text-red-600 mb-6 text-center font-semibold" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={`${styles.gradientButton} text-white py-3 rounded w-full font-bold`}
        >
          注册
        </button>

        <p className="mt-6 text-center text-gray-600">
          已有账号？{" "}
          <Link href="/login" className="text-yellow-600 hover:underline font-medium">
            去登录
          </Link>
        </p>
      </form>
    </div>
  );
}
