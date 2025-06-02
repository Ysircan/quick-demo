// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
    output   = "../node_modules/.prisma/client" // ✅ 正确写法
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


model User {                            // v0.1  
  id         String   @id @default(cuid())
  // ✅ 用户唯一 ID，用于所有数据关联

  email      String   @unique
  // ✅ 邮箱，用于登录，唯一值

  name       String
  // ✅ 用户名 / 昵称，展示用

  password   String
  // ✅ 登录密码，后端会加密存储

  role       Role
  // ✅ 用户身份，区分学生 / 教师

  avatarUrl  String?  @default("https://yourcdn.com/default-avatar.png")
  // ✅ 可选头像，默认使用平台默认图

  createdAt  DateTime @default(now())
  // ✅ 注册时间

  studentProfile StudentProfile? @relation("UserToStudent")
  // ✅ 如果是学生，关联学生扩展信息

  teacherProfile TeacherProfile? @relation("UserToTeacher")
  // ✅ 如果是老师，关联老师扩展信息

  courses        Course[]        @relation("CourseTeacher")
   
  // ✅ 教师创建的课程（老师可创建多个课程）
}
// ✅ 用户角色枚举（学生 or 教师）
enum Role {                            // v0.1  
  STUDENT
  TEACHER
}
model StudentProfile {                             // v0.1  
  id        String   @id @default(cuid())
  // ✅ 学生扩展信息 ID

  user      User     @relation("UserToStudent", fields: [userId], references: [id])
  userId    String   @unique
  // ✅ 外键关联 User 表，确保一对一绑定

  points    Int      @default(0)
  // ✅ 学生积分，用于抽卡、激励等系统
}

model TeacherProfile {                            // v0.1  
  id        String   @id @default(cuid())
  // ✅ 教师扩展信息 ID

  user      User     @relation("UserToTeacher", fields: [userId], references: [id])
  userId    String   @unique
  // ✅ 外键关联 User 表，确保一对一绑定
}

model Course {                             // v0.1  
  id           String   @id @default(cuid())
  // ✅ 课程唯一 ID

  title        String
  // ✅ 课程标题

  description  String
  // ✅ 课程描述

  coverImage   String
  // ✅ 封面图 URL

  tags         String[]
  // ✅ 标签关键词

  type         String
  // ✅ 类型（资料课 / 刷题任务 / 视频课等）

  category     String?
  // ✅ 类目（语文 / 法考等）

  difficulty   String
  // ✅ 难度等级

  durationDays Int
  // ✅ 建议周期（天）

  price        Int
  // ✅ 价格（整数元）

  rating       Float?
  // ✅ 用户评分（选填）

  enrollment   Int      @default(0)
  // ✅ 报名人数

  isPublished  Boolean  @default(false)
  // ✅ 是否发布

  allowPreview Boolean  @default(false)
  // ✅ 是否允许试看

  previewDescription String?
  // ✅ 试看说明

  videoUrl     String?
  // ✅ 试看视频链接

  isPrimary    Boolean  @default(true)
  // ✅ 是否为主课程（false = DLC）

  parentId     String?
  // ✅ DLC 对应主课程 ID

  parentCourse Course?  @relation("CourseToParent", fields: [parentId], references: [id])
  childCourses Course[] @relation("CourseToParent")
  // ✅ DLC 课程绑定

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  teacherId    String
  teacher      User     @relation("CourseTeacher", fields: [teacherId], references: [id])

  // ✅ 子表：题目列表
  questions    Question[]

  // ✅ 子表：报名记录
  enrollments  EnrolledCourse[]

}

model Question {                            // v0.2 
  id          String   @id @default(cuid())
  // ✅ 题目唯一 ID，用于系统内题目追踪

  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  // ✅ 所属课程外键与关系（父表）

  content     String
  // ✅ 题干内容，支持 Markdown 或富文本格式

  type        String
  // ✅ 题型（如 choice / cloze / short / truefalse 等）

  options     String[] // 仅用于选择/填空题
  // ✅ 可选项数组，适配选择题/填空题等结构化题型

  answer      String
  // ✅ 正确答案（支持 JSON / 纯文本）

  explanation String?
  // ✅ 答案解析（可选，若为空可由 AI 生成）

  difficulty  String   @default("medium")
  // ✅ 难度等级（easy / medium / hard）

  score       Int      @default(10)
  // ✅ 题目基础积分（答对获得积分，可用于排行榜或奖励系统）

  mediaUrl    String?
  mediaType   String?
  // ✅ 多媒体支持：题干插图 / 音频 / 视频（image / audio / video）

  groupId     String?
  // ✅ 题组 ID（如：阅读理解五题一组，多个题目共用一个 ID）

  releaseDay  Int?     
  // ✅ 解锁日（第几天可见，用于节奏控制）

  isActive    Boolean  @default(true)
  // ✅ 是否启用该题目（用于隐藏/下架等处理）

  authorId    String?
  // ✅ 作者 ID（预留字段，便于后续区分命题人或协作教师）

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  // ✅ 创建与更新时间

  // ✅ 子表 1：学生错题记录
  feedbacks   QuestionFeedback[]

  // ✅ 子表 2：AI 解答记录（如点击“AI帮我讲解”）
  aiResponses QuestionAIResponse[]
   // 🔗 新增子表：掉落与 Buff
  drops       QuestionDropConfig[]     // ✅ 多卡掉落控制
}





model QuestionDropConfig {              // v0.1
  id          String   @id @default(cuid())
  questionId  String
  question    Question @relation(fields: [questionId], references: [id])
  // ✅ 外键，关联题目

  cardId      String
  card        Card     @relation(fields: [cardId], references: [id])
  // ✅ 掉落的卡牌 ID

  dropRate    Float    @default(0.2)
  // ✅ 掉率（如 0.2 表示 20% 掉落几率）

  dropLimit   Boolean  @default(true)
  // ✅ 是否限制每位学生仅可掉落一次

  validUntil  DateTime?
  // ✅ 掉落有效期（如限时活动，过期后不再掉落）

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}



model QuestionFeedback {                      // v0.1
  id          String   @id @default(cuid())
  // ✅ 唯一 ID，每一次作答行为都记录一条日志

  studentId   String
  // ✅ 学生 ID（答题者）

  questionId  String
  // ✅ 题目 ID（对应 Question）

  courseId    String
  // ✅ 所属课程 ID（便于按课程查询统计）

  answer      String
  // ✅ 学生作答内容（原样记录，可用于纠错追溯）

  isCorrect   Boolean
  // ✅ 是否答对（false → 纳入错题统计）

  resolved    Boolean  @default(false)
  // ✅ 是否被学生标记为“已掌握”，移出错题本（可选功能）

  aiUsed      Boolean? 
  // ✅ 是否使用 AI 辅助答题（用于分析依赖性）

  reviewed    Boolean  @default(false)
  // ✅ 是否被老师 / AI 复查过，用于后期内容优化

  createdAt   DateTime @default(now())
  // ✅ 答题时间（用于节奏追踪、时间统计）

  // ✅ 外键关系
  student     User     @relation(fields: [studentId], references: [id])
  question    Question @relation(fields: [questionId], references: [id])
}
model QuestionAIResponse {                      // v0.1
  id           String   @id @default(cuid())
  // ✅ 主键，用于唯一标识本次提问记录

  questionId   String
  // ✅ 外键，关联题目（Question）

  studentId    String
  // ✅ 外键，关联提问的学生用户（User）

  input        String
  // ✅ 学生输入的问题（如“为什么选A？”）

  aiOutput     String
  // ✅ AI 返回的回答内容（可用于训练、评估）

  usedAt       DateTime @default(now())
  // ✅ 使用时间（用于统计提问高峰等）

  feedback     String?
  // ✅ 学生对AI回答的反馈（如“讲得很清楚”“还是不懂”）

  rating       Int?     // 1~5 之间（可选）
  // ✅ 学生评分（用于判断回答质量）

  isHelpful    Boolean? // 可选：后期用于训练判断 helpful vs not
  // ✅ 是否被标记为“有帮助”

  fromModel    String?  // 如 'gpt-4', 'zhipu', 'claude'
  // ✅ 使用的 AI 模型来源，方便分析效果

  metadata     Json?    // 可扩展记录上下文、prompt内容等
  // ✅ 额外训练用元信息（如 Prompt 参数、课程上下文）

  // 🔁 关系
  question     Question @relation(fields: [questionId], references: [id])
}
model AIQuestionGenerationLog {                 //V 0.2
  id            String   @id @default(cuid())
  teacherId     String
  topic         String?
  inputText     String?
  structure     Json
  generated     Json
  usedCount     Int      @default(0)

  promptId      String?
  prompt        PromptTemplate? @relation(fields: [promptId], references: [id])
  promptVersion Int?            // prompt 使用时的版本号

  createdAt     DateTime @default(now())
}
model PromptTemplate {                          // V0.1
  id              String   @id @default(cuid())
  name            String
  description     String?
  isActive        Boolean  @default(true)
  currentVersion  Int      @default(1)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  logs            AIQuestionGenerationLog[]
}

model EnrolledCourse {                        //0.1
  id           String   @id @default(cuid())
  // ✅ 报名记录唯一 ID

  studentId    String
  // ✅ 学生 ID（报名者）

  courseId     String
  // ✅ 报名的课程 ID

  enrolledAt   DateTime @default(now())
  // ✅ 报名时间

  isCompleted  Boolean  @default(false)
  // ✅ 是否已完成该课程（全部题目完成或手动标记）

  progress     Int      @default(0)
  // ✅ 当前进度（0~100，表示已完成题目百分比）

  score        Int?
  // ✅ 课程总得分（自动统计或老师评分，可选）

  rank         Int?
  // ✅ 班级内排名（可选字段，用于排行榜展示）

  certificate  String?
  // ✅ 证书编号或链接（用于生成电子证书或打印）

  notes        String?
  // ✅ 报名备注（老师手动添加，或学生报名时留言）

  source       String?
  // ✅ 报名来源（如“公开课”、“家长群”、“特邀链接”等）

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  // ✅ 创建时间 / 更新时间（系统自动生成）

  // ===== 关联关系 =====

  student      User     @relation(fields: [studentId], references: [id])
  // ✅ 与 User 表（学生）关联

  course       Course   @relation(fields: [courseId], references: [id])
  // ✅ 与 Course 表（课程）关联

  tasks        EnrolledCourseTask[]
  // ✅ 子表：记录该学生在此课程下每道题目的完成状态

  @@unique([studentId, courseId])
  // ✅ 限制：每位学生一门课只能报名一次（不允许重复报名）
}
model EnrolledCourseTask {
  id                String   @id @default(cuid())
  // ✅ 唯一 ID，每位学生每门课每题一条记录

  enrolledCourseId  String
  // ✅ 所属课程报名记录（学生报了哪门课）

  questionId        String
  // ✅ 对应题目 ID（题干来自 Question 表）

  status            TaskStatus @default(PENDING)
  // ✅ 当前状态：未作答 / 正确 / 错误

  submittedAt       DateTime?
  // ✅ 学生提交作答时间（未提交为 null）

  answer            String?
  // ✅ 学生的作答内容（用于主观题等）

  isCorrect         Boolean?
  // ✅ 是否答对（系统或老师判断）

  aiUsed            Boolean?
  // ✅ 是否使用 AI 辅助答题（行为分析用）

  feedback          String?
  // ✅ 系统或老师给的反馈语句

  resolved          Boolean @default(false)
  // ✅ 是否标记为“已掌握” → 错题再做时排除

  reviewed          Boolean @default(false)
  // ✅ 是否已被老师或系统复查（可批改状态）

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  // ✅ 时间戳记录

  // === 关联关系 ===
  enrolledCourse    EnrolledCourse @relation(fields: [enrolledCourseId], references: [id])
  question          Question       @relation(fields: [questionId], references: [id])

  @@unique([enrolledCourseId, questionId])
  // ✅ 保证一位学生在同一课程中对同一题只有一条任务记录
}
enum TaskStatus {
  PENDING   // 未作答
  CORRECT   // 答对了
  WRONG     // 答错了
}
model StudentSessionLog {                       //v1.0
  id         String   @id @default(cuid())
  // ✅ 唯一 ID，每次会话一条记录

  studentId  String
  // ✅ 学生 ID（谁在使用系统）

  page       String
  // ✅ 所在页面路径（如 "/student/task/abc"），用于热力分析

  courseId   String?
  // ✅ 可选：当前访问页面绑定的课程 ID（若属于某课程）

  startedAt  DateTime
  // ✅ 页面进入时间（学生访问页面的时间点）

  endedAt    DateTime?
  // ✅ 离开页面时间（关闭或切换页面）

  duration   Int?
  // ✅ 停留时长（单位：秒，系统可在后端计算）

  student    User     @relation(fields: [studentId], references: [id])
  course     Course?  @relation(fields: [courseId], references: [id])

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([studentId])
  @@index([startedAt])
  // ✅ 提高查询性能（按学生/时间段分析）
}



model DailyDropLog {                              //v0.1
  id         String   @id @default(cuid())
  // ✅ 唯一 ID，每次掉落记录一条

  studentId  String
  // ✅ 学生 ID

  cardId     String
  // ✅ 掉落的卡牌 ID（卡牌主表）

  source     DropSource
  // ✅ 掉落来源（答题、学习时长、签到、活动等）

  courseId   String?
  // ✅ 可选：来源课程（便于统计课程掉卡分布）

  questionId String?
  // ✅ 可选：若由某题触发，记录该题目 ID

  rewardTime DateTime @default(now())
  // ✅ 掉落时间（用于节奏追踪、奖励展示）

  student    User     @relation(fields: [studentId], references: [id])
  card       Card     @relation(fields: [cardId], references: [id])
  course     Course?  @relation(fields: [courseId], references: [id])
  question   Question?@relation(fields: [questionId], references: [id])

  @@index([studentId])
  @@index([rewardTime])
}

enum DropSource {
  TASK         // 做题后掉落
  STREAK       // 连续签到
  ONLINE_TIME  // 在线学习满时
  EVENT        // 系统活动掉落
  MANUAL       // 管理员手动发放
}

model Card {
  id          String   @id @default(cuid())
  name        String   // 卡牌名称
  description String?  // 卡牌描述（可选）
  mediaUrl    String?  // 卡牌资源链接
  mediaType   String?  // 媒体类型：如 image / audio / video
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 外部关联用
  drops       DailyDropLog[]  // 卡牌掉落记录表
  collection  CardCollection[] 
}


model CardCollection {
  id        String   @id @default(cuid())

  studentId String
  cardId    String

  card      Card     @relation(fields: [cardId], references: [id])
  student   User     @relation(fields: [studentId], references: [id])

  acquiredAt DateTime @default(now())

  @@unique([studentId, cardId])
}
