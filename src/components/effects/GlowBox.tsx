"use client";

import { ReactNode } from "react";

export default function GlowBox({ children }: { children: ReactNode }) {
  return (
    <div className="relative group w-fit h-fit">
      {children}

      {/* 四条边线条 */}
      <span className="absolute top-0 left-0 h-[2px] bg-purple-500 w-0 group-hover:w-full transition-all duration-700" />
      <span className="absolute top-0 left-0 w-[2px] bg-purple-500 h-0 group-hover:h-full transition-all duration-700 delay-75" />
      <span className="absolute bottom-0 right-0 h-[2px] bg-purple-500 w-0 group-hover:w-full transition-all duration-700 delay-150" />
      <span className="absolute bottom-0 right-0 w-[2px] bg-purple-500 h-0 group-hover:h-full transition-all duration-700 delay-225" />
    </div>
  );
}
