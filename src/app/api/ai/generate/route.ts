import { NextRequest, NextResponse } from "next/server";
import { PromptParams } from "@/components/ai/type";
import { generatePrompt } from "@/components/ai/promptmethod";

const API_URL = "https://api.laozhang.ai/v1/chat/completions";
const API_KEY = process.env.OPENAI_API_KEY || "your_key_here";

// ✨ 类型识别函数
function inferType(item: any): "choice" | "cloze" | "short" {
  if (Array.isArray(item.options) && item.options.length > 0) return "choice";
  if (typeof item.question === "string" && (item.question.includes("____") || item.question.includes("{"))) {
    return "cloze";
  }
  return "short";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as PromptParams;
    console.log("🪵 收到的请求体：", body); // ← 加上这行
    
    let { topic, structure, inputText, style, model } = body;
    
    // 只设置一次默认值
    model = model || "chatgpt-4o-latest";

    // 检查必要的参数
    if (!structure || structure.length === 0) {
      return NextResponse.json({ error: "缺少题目结构参数 structure" }, { status: 400 });
    }
    
    // 检查 topic 或 inputText 至少有一个不为空
    if ((!topic || topic.trim() === '') && (!inputText || inputText.trim() === '')) {
      return NextResponse.json({ error: "主题(topic)和输入文本(inputText)不能同时为空" }, { status: 400 });
    }
    
    // 如果 topic 为空但 inputText 不为空，使用 inputText 作为 topic
    if ((!topic || topic.trim() === '') && inputText && inputText.trim() !== '') {
      topic = inputText;
    }

    // 👉 构建 Prompt
    const prompt = generatePrompt({ topic, structure, inputText, style });
    console.log("📡 发送 prompt：", prompt);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ AI 接口错误：", errorText);
      return NextResponse.json({ error: "AI 接口失败", detail: errorText }, { status: 502 });
    }

    const result = await response.json();
    const answer = result.choices?.[0]?.message?.content || "未返回内容";
    console.log("🧠 AI 原始返回内容：", answer);

    let parsed: any[] = [];
    try {
      const clean = answer.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = [
        {
          question: "⚠️ AI 返回的内容无法解析为标准 JSON",
          answer: "",
          options: [],
          raw: answer
        }
      ];
    }

    // ✂️ 裁剪题目数量
    const totalCount = structure.reduce((sum, item) => sum + item.count, 0);
    const trimmed = parsed.slice(0, totalCount);

    // 🧠 加入 type 字段
    const enhanced = trimmed.map((item) => ({
      ...item,
      type: inferType(item)
    }));

    return NextResponse.json(enhanced);
  } catch (err) {
    console.error("❌ 服务器异常", err);
    return NextResponse.json({ error: "服务器异常", detail: String(err) }, { status: 500 });
  }
}
