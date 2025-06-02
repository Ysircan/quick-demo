"use client";

import Link from "next/link";

export default function NavBar() {
  const navItems = [
    { name: "主页", href: "/" },
    { name: "教师端", href: "/teacher/dashboard" },
    { name: "商城", href: "/student/store" },
    { name: "登录", href: "/login" },
    { name: "关于", href: "/about" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-8 text-sm font-medium text-white">
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
