// app/api/ai/generateWithPrompt/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "缺少 prompt 参数" }, { status: 400 });
    }

    const YOUR_API_URL = "https://api.laozhang.ai/v1/chat/completions";
    const YOUR_API_KEY = "sk-Zg3HVbSJM98n1WV15cA03c829b1c4b799dEd104e4c9d8050";

    const response = await fetch(YOUR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${YOUR_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-1106-preview", // 老张API常见模型之一
        messages: [
          {
            role: "user",
            content: prompt, // 把 prompt 放到 message 里
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("💥 AI 接口错误:", errorText);
      return NextResponse.json({ error: "AI接口响应失败", detail: errorText }, { status: 500 });
    }

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content ?? "未返回内容";

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("❌ 生成题目失败：", error);
    return NextResponse.json({ error: "服务器错误", detail: String(error) }, { status: 500 });
  }
}
