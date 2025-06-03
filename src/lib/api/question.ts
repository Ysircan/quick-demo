// 文件路径：/lib/api/question.ts

export type QuestionType = 'choice' | 'short' | 'cloze';

export interface CreateQuestionInput {
  type: QuestionType; // 题目类型：选择题、简答题、填空题
  content: string; // 题干内容
  options?: string[]; // 选项（仅适用于选择题）
  answer: string; // 正确答案
  explanation?: string; // 答案解析（可选）
}

export interface BatchSaveQuestionRequest {
  courseId: string; // 所属课程ID
  questions: CreateQuestionInput[]; // 批量题目列表
}

export interface QuestionResponse {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[];
  answer: string;
  explanation?: string;
  createdAt: string;
}

export interface BatchSaveQuestionResponse {
  success: boolean;
  createdCount: number;
  failedCount?: number;
  message?: string;
}
