// ✅ 文件路径：/src/lib/api/feedback.ts

// ✅ 反馈提交结构：学生提交题目反馈使用
export interface FeedbackSubmitRequest {
  courseId: string;     // 课程 ID（用于识别所属任务）
  questionId: string;   // 题目 ID（必须）
  answer: string;       // 学生提交的答案
  isCorrect: boolean;   // 是否答对
  aiUsed?: boolean;     // 是否使用了 AI 辅助（可选）
  feedback?: string;    // 学生填写的主观反馈（可选）
}

// ✅ 反馈接口响应结构：统一成功与错误响应
export interface FeedbackSubmitResponse {
  success: boolean;
  error?: string;       // 如果出错，返回错误信息
}
