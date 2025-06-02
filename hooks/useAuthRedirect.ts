'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthRedirect(allowedRoles: string[] = []) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    // 如果没有 token 或 user，跳转登录页
    if (!token || !userStr) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // 如果角色不允许，强制登出并跳转登录页
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("权限不足，请重新登录");
        router.replace("/login");
      }
    } catch (e) {
      console.error("用户信息解析失败");
      router.replace("/login");
    }
  }, []);
}
