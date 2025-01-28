/*
  Warnings:

  - The primary key for the `attractions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `events` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `forum_posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attractions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "z" REAL NOT NULL,
    "imagePath" TEXT NOT NULL
);
INSERT INTO "new_attractions" ("description", "id", "imagePath", "location", "name", "x", "y", "z") SELECT "description", "id", "imagePath", "location", "name", "x", "y", "z" FROM "attractions";
DROP TABLE "attractions";
ALTER TABLE "new_attractions" RENAME TO "attractions";
CREATE TABLE "new_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_events" ("createdById", "date", "description", "id", "location", "title") SELECT "createdById", "date", "description", "id", "location", "title" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE TABLE "new_forum_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "forum_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_forum_posts" ("content", "id", "title", "userId") SELECT "content", "id", "title", "userId" FROM "forum_posts";
DROP TABLE "forum_posts";
ALTER TABLE "new_forum_posts" RENAME TO "forum_posts";
CREATE TABLE "new_reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT NOT NULL,
    "eventId" TEXT,
    "attractionId" TEXT,
    CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reviews_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reviews_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "attractions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_reviews" ("attractionId", "content", "eventId", "id", "rating", "userId") SELECT "attractionId", "content", "eventId", "id", "rating", "userId" FROM "reviews";
DROP TABLE "reviews";
ALTER TABLE "new_reviews" RENAME TO "reviews";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("createdAt", "email", "id", "name", "password", "role") SELECT "createdAt", "email", "id", "name", "password", "role" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
