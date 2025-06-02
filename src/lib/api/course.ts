// 请求参数：创建课程
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
  discountStart?: string  // ISO 日期字符串
  discountEnd?: string
  previewDescription?: string
  videoUrl?: string
}

// 响应字段：课程对象（简化版）
export interface CourseResponse {
  id: string
  title: string
  description: string
  isPublished: boolean
  price: number
  createdAt: string
  updatedAt: string
}
