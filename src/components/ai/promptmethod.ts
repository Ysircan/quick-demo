// 📄 components/ai/promptmethod.ts

import { PromptParams, QuestionType } from './type';

const typeMap: Record<QuestionType, string> = {
  choice: '选择题',
  short: '简答题',
  cloze: '填空题',
};

export function generatePrompt({ topic, structure, style }: PromptParams): string {
  const list = structure.map(
    ({ type, count }) => `- ${count} 道${typeMap[type] || type}`
  );

  const total = structure.reduce((sum, item) => sum + item.count, 0);

  const baseInstruction = `你是一位中文命题专家。请围绕“${topic}”这个主题生成题目，**不要添加任何解释**。`;
  const styleInstruction = style ? `题目风格应贴近：${style}` : '';
  const quantityInstruction = `请生成共 ${total} 道题目，题型如下：\n${list.join('\n')}`;

  return [
    baseInstruction,
    quantityInstruction,
    styleInstruction,
    '',
    '📌 格式要求：',
    '- 输出必须是合法 JSON 数组；',
    '- 不要使用 Markdown 代码块（```）、解释说明或多余文本；',
    '',
    '示例格式：',
    '[',
    '  {',
    '    "question": "题干内容",',
    '    "options": ["选项A", "选项B", "选项C", "选项D"],',
    '    "answer": "选项A"',
    '  }',
    ']',
    '',
    '✅ 输出规范：',
    '1. 选择题包含 "question"、"options"、"answer" 三个字段；',
    '2. 简答题或填空题只包含 "question" 和 "answer"；',
    '3. 所有字段必须使用英文双引号（"）包装；',
    '4. 最终输出必须是纯 JSON 数组格式。',
  ].join('\n');
}
