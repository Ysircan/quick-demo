// ✅ type.ts

// 支持的题目类型
export type QuestionType = 'choice' | 'short' | 'cloze';

// 单个题目结构
export interface Question {
  question: string;         // 题干内容
  answer: string;           // 正确答案
  options?: string[];       // 仅选择题有选项
}

// 出题结构：题型 + 数量
export interface QuestionStructure {
  type: QuestionType;       // 题型：选择题、简答题、填空题
  count: number;            // 出几道
}

// 用于生成 prompt 的完整参数
export interface PromptParams {
  topic: string;                            // 出题主题，如“热力学”
  structure: QuestionStructure[];           // 多题型组合
  style?: string;                           // 出题风格，如“高考、雅思”
}
