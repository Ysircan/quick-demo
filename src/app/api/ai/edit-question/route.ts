// /src/app/api/ai/edit-question/route.ts

export async function POST(req: Request) {
  try {
    const { question, suggestion, style } = await req.json();

    if (!question || !suggestion) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userPrompt = `
你是一个教育助手，请根据教师修改建议，输出一道更贴合要求的新题目，使用 JSON 格式返回，不要添加解释。

原始题目：
${JSON.stringify(question, null, 2)}

教师修改建议：
${suggestion}

${style ? `请确保符合如下风格要求：${style}` : ''}

请严格使用以下格式返回（不要包含 Markdown 或多余文字）：
{
  "question": "...",
  "options": ["A", "B", "C", "D"], // 如无选项可省略
  "answer": "..."
}`.trim();

    const apiRes = await fetch("https://api.laozhang.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || "your_key_here"}`
      },
      body: JSON.stringify({
        model: "chatgpt-4o-latest",
        messages: [
          { role: "system", content: "你是一个帮助老师修改题目的教育助理。" },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3
      })
    });

    const data = await apiRes.json();
    const rawText = data.choices?.[0]?.message?.content || "";

    console.log("🧠 AI 原始返回内容：", rawText);

    if (!rawText.trim()) {
      return new Response(JSON.stringify({ error: "AI 返回内容为空，请重试。" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
      return new Response(JSON.stringify({ error: "AI 返回内容格式错误，无法提取 JSON。" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const parsed = JSON.parse(match[0]);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("❌ AI 编辑失败:", err.message || err);
    return new Response(JSON.stringify({ error: "AI 修改失败，请稍后重试。" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
