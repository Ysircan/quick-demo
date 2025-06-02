'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuickLayout from "@/components/layout";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "注册失败，请重试");
        return;
      }

      setSuccess("✅ 注册成功，正在跳转...");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("请求失败，请稍后再试");
    }
  };

  return (
    <QuickLayout>
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden bg-transparent flex items-center justify-center text-white">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 bg-transparent"
        >
          <h2 className="text-2xl font-bold text-center">注册</h2>

          {/* 角色切换 */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`px-4 py-2 rounded ${
                role === "STUDENT"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-black"
              }`}
            >
              学生
            </button>
            <button
              type="button"
              onClick={() => setRole("TEACHER")}
              className={`px-4 py-2 rounded ${
                role === "TEACHER"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-black"
              }`}
            >
              老师
            </button>
          </div>

          <input
            type="text"
            placeholder="姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/10 text-white border-none p-2 rounded placeholder-gray-400"
            required
          />

          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/10 text-white border-none p-2 rounded placeholder-gray-400"
            required
          />

          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 text-white border-none p-2 rounded placeholder-gray-400"
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 rounded"
          >
            注册
          </button>

          <p className="text-center text-sm">
            已有账号？{" "}
            <a href="/login" className="text-blue-400 underline">
              去登录
            </a>
          </p>
        </form>
      </div>
    </QuickLayout>
  );
}
