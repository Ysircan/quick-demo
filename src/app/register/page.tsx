'use client';

import { useState } from "react";
import { AuthAPI, RegisterRequest } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    region: "CN",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    const res = await fetch(AuthAPI.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "注册失败");
    } else {
      alert("注册成功！");
      router.push("/login");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-gray-900">注册账号</h1>

      <input
        name="name"
        placeholder="姓名"
        onChange={handleChange}
        className="input mb-2 w-full border border-gray-300 px-3 py-2 rounded text-black"
      />
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

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="input mb-2 w-full border border-gray-300 px-3 py-2 rounded text-black"
      >
        <option value="STUDENT">我是学生</option>
        <option value="TEACHER">我是老师</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        注册
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* 👉 去登录 */}
      <p className="mt-4 text-center text-sm text-gray-900">
        已有账号？
        <button
          onClick={() => router.push("/login")}
          className="text-blue-600 underline ml-1"
        >
          去登录
        </button>
      </p>
    </div>
  );
}
