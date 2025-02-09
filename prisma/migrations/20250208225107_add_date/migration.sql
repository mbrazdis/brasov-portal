-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_forum_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "forum_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_forum_posts" ("content", "id", "title", "userId") SELECT "content", "id", "title", "userId" FROM "forum_posts";
DROP TABLE "forum_posts";
ALTER TABLE "new_forum_posts" RENAME TO "forum_posts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
