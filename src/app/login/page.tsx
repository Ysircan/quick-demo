'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuickLayout from "@/components/layout";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "登录失败，请重试");
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.role === "TEACHER") {
        router.push("/teacher/dashboard");
      } else if (data.role === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        setError("未知用户角色");
      }
    } catch {
      setError("请求异常，请稍后再试");
    }
  }

  return (
    <QuickLayout>
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden flex items-center justify-center text-white">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 bg-transparent"
        >
          <h2 className="text-2xl font-bold text-center">登录</h2>

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

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 rounded"
          >
            登录
          </button>

          <p className="text-center text-sm">
            还没有账号？{" "}
            <a href="/register" className="text-blue-400 underline">
              去注册
            </a>
          </p>
        </form>
      </div>
    </QuickLayout>
  );
}
