import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "已登出" });

  response.cookies.set({
    name: "token",
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}
