-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "imagePath" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
