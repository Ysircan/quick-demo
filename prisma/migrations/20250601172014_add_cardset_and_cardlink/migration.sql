/*
  Warnings:

  - You are about to drop the column `structure` on the `Course` table. All the data in the column will be lost.
  - The `options` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DropSource" AS ENUM ('TASK', 'STREAK', 'ONLINE_TIME', 'EVENT', 'MANUAL');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'CORRECT', 'WRONG');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "structure",
ADD COLUMN     "allowPreview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "previewDescription" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mediaType" TEXT,
ADD COLUMN     "mediaUrl" TEXT,
ADD COLUMN     "releaseDay" INTEGER,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "options",
ADD COLUMN     "options" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT DEFAULT 'https://yourcdn.com/default-avatar.png';

-- CreateTable
CREATE TABLE "QuestionDropConfig" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "dropRate" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "dropLimit" BOOLEAN NOT NULL DEFAULT true,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionDropConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionFeedback" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "aiUsed" BOOLEAN,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAIResponse" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "aiOutput" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedback" TEXT,
    "rating" INTEGER,
    "isHelpful" BOOLEAN,
    "fromModel" TEXT,
    "metadata" JSONB,

    CONSTRAINT "QuestionAIResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrolledCourse" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER,
    "rank" INTEGER,
    "certificate" TEXT,
    "notes" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnrolledCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrolledCourseTask" (
    "id" TEXT NOT NULL,
    "enrolledCourseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3),
    "answer" TEXT,
    "isCorrect" BOOLEAN,
    "aiUsed" BOOLEAN,
    "feedback" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnrolledCourseTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentSessionLog" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "courseId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentSessionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyDropLog" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "source" "DropSource" NOT NULL,
    "courseId" TEXT,
    "questionId" TEXT,
    "rewardTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyDropLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "mediaUrl" TEXT,
    "mediaType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardCollection" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardCollection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EnrolledCourse_studentId_courseId_key" ON "EnrolledCourse"("studentId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "EnrolledCourseTask_enrolledCourseId_questionId_key" ON "EnrolledCourseTask"("enrolledCourseId", "questionId");

-- CreateIndex
CREATE INDEX "DailyDropLog_studentId_idx" ON "DailyDropLog"("studentId");

-- CreateIndex
CREATE INDEX "DailyDropLog_rewardTime_idx" ON "DailyDropLog"("rewardTime");

-- CreateIndex
CREATE UNIQUE INDEX "CardCollection_studentId_cardId_key" ON "CardCollection"("studentId", "cardId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionDropConfig" ADD CONSTRAINT "QuestionDropConfig_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionDropConfig" ADD CONSTRAINT "QuestionDropConfig_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionFeedback" ADD CONSTRAINT "QuestionFeedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionFeedback" ADD CONSTRAINT "QuestionFeedback_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAIResponse" ADD CONSTRAINT "QuestionAIResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAIResponse" ADD CONSTRAINT "QuestionAIResponse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrolledCourse" ADD CONSTRAINT "EnrolledCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrolledCourse" ADD CONSTRAINT "EnrolledCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrolledCourseTask" ADD CONSTRAINT "EnrolledCourseTask_enrolledCourseId_fkey" FOREIGN KEY ("enrolledCourseId") REFERENCES "EnrolledCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrolledCourseTask" ADD CONSTRAINT "EnrolledCourseTask_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSessionLog" ADD CONSTRAINT "StudentSessionLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSessionLog" ADD CONSTRAINT "StudentSessionLog_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDropLog" ADD CONSTRAINT "DailyDropLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDropLog" ADD CONSTRAINT "DailyDropLog_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDropLog" ADD CONSTRAINT "DailyDropLog_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDropLog" ADD CONSTRAINT "DailyDropLog_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardCollection" ADD CONSTRAINT "CardCollection_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardCollection" ADD CONSTRAINT "CardCollection_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
