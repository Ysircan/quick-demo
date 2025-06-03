// D:\quick\src\lib\api\student.ts

export interface EnrollRequest {
  courseId: string;
}

export interface EnrollResponse {
  success: boolean;
  enrolledCourseId: string;
}

// ----------------------------------------

export interface TaskItem {
  questionId: string;
  content: string;
  options: string[];
  type: string;
  status: 'PENDING' | 'CORRECT' | 'WRONG';
}

export interface TaskListResponse {
  success: boolean;
  tasks: TaskItem[];
}

// ----------------------------------------

export interface SubmitAnswerRequest {
  questionId: string;
  answer: string;
  aiUsed?: boolean;
  feedback?: string;
}

export interface SubmitAnswerResponse {
  success: boolean;
  isCorrect: boolean;
  updatedStatus: 'CORRECT' | 'WRONG';
}

// ----------------------------------------

export interface WrongQuestion {
  questionId: string;
  content: string;
  answer: string;
  explanation?: string;
}

export interface WrongBookResponse {
  success: boolean;
  wrongQuestions: WrongQuestion[];
}

// ----------------------------------------

export interface CollectedCard {
  cardId: string;
  name: string;
  rarity: string; // 可以用 CardRarity 枚举
  imageUrl: string;
}

export interface CardCollectionResponse {
  success: boolean;
  cards: CollectedCard[];
}

// ----------------------------------------

export interface CardSetProgress {
  setName: string;
  collected: number;
  total: number;
}

export interface CardSetProgressResponse {
  success: boolean;
  sets: CardSetProgress[];
}

// ----------------------------------------

export interface SessionLogRequest {
  page: string;
  courseId?: string;
  startedAt: string; // ISO String
  endedAt: string;
}

export interface SessionLogResponse {
  success: boolean;
  duration: number; // in seconds
}

// ✅ 课程库（Library）
export interface LibraryCourse {
  courseId: string;
  title: string;
  description: string;
  coverImage: string;
  progress: number;
}

export interface LibraryListResponse {
  success: boolean;
  courses: LibraryCourse[];
}