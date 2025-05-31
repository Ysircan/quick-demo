'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToDemo() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/teacher/demo');
  }, [router]);

  return null;
}
