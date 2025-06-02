/*
  Warnings:

  - The `mediaType` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `difficulty` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `rarity` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `difficulty` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CardRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'GIF');

-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('MAIN', 'PRACTICE', 'EXAM');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "buffEffect" TEXT,
ADD COLUMN     "courseId" TEXT,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "rarity" "CardRarity" NOT NULL,
DROP COLUMN "mediaType",
ADD COLUMN     "mediaType" "MediaType";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "discountEnd" TIMESTAMP(3),
ADD COLUMN     "discountPrice" INTEGER,
ADD COLUMN     "discountStart" TIMESTAMP(3),
ADD COLUMN     "originalPrice" INTEGER,
DROP COLUMN "type",
ADD COLUMN     "type" "CourseType" NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "DifficultyLevel" NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "EnrolledCourseTask" ADD COLUMN     "lastTriedAt" TIMESTAMP(3),
ADD COLUMN     "redoCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "allowRepeat" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cooldownDays" INTEGER,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "DifficultyLevel";

-- AlterTable
ALTER TABLE "QuestionDropConfig" ALTER COLUMN "dropLimit" SET DEFAULT false;

-- CreateTable
CREATE TABLE "CourseCardSet" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "cardSetId" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "CourseCardSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "createdById" TEXT,
    "isFromPlatform" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardSetCard" (
    "id" TEXT NOT NULL,
    "cardSetId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "order" INTEGER,
    "note" TEXT,

    CONSTRAINT "CardSetCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardSetProgress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "cardSetId" TEXT NOT NULL,
    "collected" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardSetProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseCardSet_courseId_cardSetId_key" ON "CourseCardSet"("courseId", "cardSetId");

-- CreateIndex
CREATE UNIQUE INDEX "CardSetCard_cardSetId_cardId_key" ON "CardSetCard"("cardSetId", "cardId");

-- CreateIndex
CREATE UNIQUE INDEX "CardSetProgress_studentId_cardSetId_key" ON "CardSetProgress"("studentId", "cardSetId");

-- AddForeignKey
ALTER TABLE "CourseCardSet" ADD CONSTRAINT "CourseCardSet_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseCardSet" ADD CONSTRAINT "CourseCardSet_cardSetId_fkey" FOREIGN KEY ("cardSetId") REFERENCES "CardSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSet" ADD CONSTRAINT "CardSet_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSetCard" ADD CONSTRAINT "CardSetCard_cardSetId_fkey" FOREIGN KEY ("cardSetId") REFERENCES "CardSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSetCard" ADD CONSTRAINT "CardSetCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSetProgress" ADD CONSTRAINT "CardSetProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSetProgress" ADD CONSTRAINT "CardSetProgress_cardSetId_fkey" FOREIGN KEY ("cardSetId") REFERENCES "CardSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
