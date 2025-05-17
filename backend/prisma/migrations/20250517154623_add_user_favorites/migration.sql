/*
  Warnings:

  - You are about to drop the `EventInteraction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventInteraction" DROP CONSTRAINT "EventInteraction_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventInteraction" DROP CONSTRAINT "EventInteraction_userId_fkey";

-- DropTable
DROP TABLE "EventInteraction";
