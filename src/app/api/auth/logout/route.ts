import { NextResponse } from "next/server";

export async function POST() {
  // 登出接口逻辑（当前仅前端处理，无需服务端清除 token）
  return NextResponse.json({ message: "登出成功" });
}
