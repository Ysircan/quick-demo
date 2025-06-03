'use client';

import { useState } from "react";
import { AuthAPI, LoginRequest } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    const res = await fetch(AuthAPI.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "登录失败");
    } else {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("登录成功！");

      if (data.user.role === "TEACHER") {
        router.push("/teacher/dashboard");
      } else {
        router.push("/store");
      }
    }
  };

  return (
 <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
  <h1 className="text-xl font-bold mb-4 text-gray-900">登录账号</h1>

  <input
    name="email"
    type="email"
    placeholder="邮箱"
    onChange={handleChange}
    className="input mb-2 w-full border border-gray-300 px-3 py-2 rounded text-black"
  />
  <input
    name="password"
    type="password"
    placeholder="密码"
    onChange={handleChange}
    className="input mb-2 w-full border border-gray-300 px-3 py-2 rounded text-black"
  />

  <button
    onClick={handleSubmit}
    className="bg-blue-600 text-white py-2 px-4 rounded w-full"
  >
    登录
  </button>

  {error && <p className="text-red-500 mt-2">{error}</p>}

  {/* 👉 去注册 */}
  <p className="mt-4 text-center text-sm text-gray-900">
    还没有账号？
    <button
      onClick={() => router.push("/register")}
      className="text-blue-600 underline ml-1"
    >
      去注册
    </button>
  </p>
</div>
  );
}
