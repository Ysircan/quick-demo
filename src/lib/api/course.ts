// ========================
// 📥 创建课程请求参数
// ========================
export interface CreateCourseRequest {
  title: string
  description: string
  tags?: string[]
  type: "MAIN" | "PRACTICE" | "EXAM"
  category?: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  durationDays: number
  coverImage?: string
  price?: number
  originalPrice?: number
  discountPrice?: number
  discountStart?: string  // ISO 格式
  discountEnd?: string
  previewDescription?: string
  videoUrl?: string
  allowPreview?: boolean
}

// ========================
// 📤 通用课程响应结构
// ========================
export interface CourseResponse {
  id: string
  title: string
  description: string
  tags: string[]
  type: "MAIN" | "PRACTICE" | "EXAM"
  category?: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  durationDays: number
  coverImage?: string
  price: number
  originalPrice?: number
  discountPrice?: number
  discountStart?: string
  discountEnd?: string
  previewDescription?: string
  videoUrl?: string
  allowPreview?: boolean
  isPublished: boolean
  enrollment: number
  rating?: number
  createdAt: string
  updatedAt: string
}

// ========================
// ✏️ 更新课程请求参数（与创建结构一致，部分字段可省略）
// ========================
export type UpdateCourseRequest = Partial<CreateCourseRequest>

// ========================
// ✅ 发布 / 下架课程 PATCH 请求
// ========================
export interface PublishCourseRequest {
  isPublished: boolean
}
