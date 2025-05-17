-- CreateTable
CREATE TABLE "EventInteraction" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventInteraction_eventId_idx" ON "EventInteraction"("eventId");

-- CreateIndex
CREATE INDEX "EventInteraction_userId_idx" ON "EventInteraction"("userId");

-- CreateIndex
CREATE INDEX "EventInteraction_type_idx" ON "EventInteraction"("type");

-- CreateIndex
CREATE INDEX "EventInteraction_createdAt_idx" ON "EventInteraction"("createdAt");

-- AddForeignKey
ALTER TABLE "EventInteraction" ADD CONSTRAINT "EventInteraction_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInteraction" ADD CONSTRAINT "EventInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
