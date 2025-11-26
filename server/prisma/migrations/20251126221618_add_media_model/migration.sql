-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "ownerType" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'IMAGE',
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Media_ownerType_ownerId_idx" ON "Media"("ownerType", "ownerId");
