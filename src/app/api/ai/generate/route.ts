// ✅ /api/ai/generate 接口：支持 mock 先行，后续平滑接入真实 AI API
// 文件: /app/api/ai/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generatePrompt } from "@/components/ai/promptmethod"; // ✅ 引入 prompt 生成器

// 定义统一题目结构类型
interface AIQuestion {
  type: "choice" | "short" | "cloze";
  content: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

// Mock 生成函数（开发期使用）
function generateMockQuestions(topic: string, structure: any): AIQuestion[] {
  const types = structure?.types || ["choice"];
  const count = structure?.count || 3;
  const questions: AIQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length] as "choice" | "short" | "cloze";
    questions.push({
      type,
      content: `关于「${topic}」的${type}题 ${i + 1}`,
      options: type === "choice" ? ["A", "B", "C", "D"] : undefined,
      answer: type === "choice" ? "A" : `这是${type}题的参考答案`,
      explanation: "这是参考解析，可选项"
    });
  }

  return questions;
}

// ✅ 主接口处理函数
export async function POST(req: NextRequest) {
  const { topic, structure, style } = await req.json();

  if (!topic || !structure) {
    return NextResponse.json({ error: "缺少 topic 或 structure 参数" }, { status: 400 });
  }

  try {
    // ✅ 打印构造出的提示词（为将来 AI 调用准备）
    const prompt = generatePrompt({ topic, structure, style });
    console.log("🧠 构造的 prompt:", prompt);

    // ✅ 当前使用 mock 数据模拟
    const questions = generateMockQuestions(topic, structure);

    return NextResponse.json({ success: true, questions });
  } catch (err) {
    return NextResponse.json({ error: "题目生成失败", detail: String(err) }, { status: 500 });
  }
}
