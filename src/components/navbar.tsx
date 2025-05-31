"use client";

import Link from "next/link";

export default function NavBar() {
  const navItems = [
    { name: "主页", href: "/teacher/demo" },
    { name: "教师端", href: "/teacher/dashboard" },
    { name: "学生任务", href: "/student/task" },
    { name: "登录", href: "/login" },
    { name: "关于", href: "/about" }, // 可留空或写跳转
  ];

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-8 text-sm font-medium text-white">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="hover:underline underline-offset-4 transition"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
