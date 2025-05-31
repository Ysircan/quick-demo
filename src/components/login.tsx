"use client";

import type { FormEvent } from "react";

interface LoginProps {
  email: string;
  password: string;
  onEmailChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onSubmit: (e: FormEvent) => void;
  error?: string;
}

export default function Login({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  error,
}: LoginProps) {
  return (
    <div className="flex justify-center mt-20 bg-gray-900 min-h-screen">
      <form
        onSubmit={onSubmit}
        className="relative w-[360px] p-6 bg-gray-800 rounded-lg shadow-lg"
      >
        {/* 登录框四角装饰 */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-300" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-300" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-300" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-300" />

        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-6 text-center text-white">登录</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="用户名/邮箱"
              className="w-full p-2 bg-gray-700 text-white placeholder-gray-400 outline-none rounded"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="密码"
              className="w-full p-2 bg-gray-700 text-white placeholder-gray-400 outline-none rounded"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded bg-yellow-400 text-black hover:bg-yellow-500 transition"
          >
            登录
          </button>
        </div>
      </form>
    </div>
  );
}
