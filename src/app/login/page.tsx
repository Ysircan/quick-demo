"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuickLayout from "@/components/layout";
import Login from "@/components/login";

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
      <Login
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        error={error}
      />
    </QuickLayout>
  );
}
