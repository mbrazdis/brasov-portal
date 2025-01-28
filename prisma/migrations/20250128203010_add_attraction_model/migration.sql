/*
  Warnings:

  - You are about to drop the column `createdAt` on the `forum_posts` table. All the data in the column will be lost.
  - Added the required column `imagePath` to the `attractions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attractions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "z" REAL NOT NULL,
    "imagePath" TEXT NOT NULL
);
INSERT INTO "new_attractions" ("description", "id", "location", "name", "x", "y", "z") SELECT "description", "id", "location", "name", "x", "y", "z" FROM "attractions";
DROP TABLE "attractions";
ALTER TABLE "new_attractions" RENAME TO "attractions";
CREATE TABLE "new_forum_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "forum_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_forum_posts" ("content", "id", "title", "userId") SELECT "content", "id", "title", "userId" FROM "forum_posts";
DROP TABLE "forum_posts";
ALTER TABLE "new_forum_posts" RENAME TO "forum_posts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
