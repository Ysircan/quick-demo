'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: '商店', href: '/store' },
  { name: '我的课程', href: '/student/store/library' },
  { name: '卡牌图鉴', href: '/student/cards' },
];

export default function StudentNavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#121212] px-6 py-4 flex gap-6 text-white shadow-md">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`hover:underline text-sm transition ${
            pathname.startsWith(item.href)
              ? 'text-blue-400 font-bold'
              : 'text-gray-300'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
