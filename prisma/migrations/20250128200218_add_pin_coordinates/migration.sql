/*
  Warnings:

  - Added the required column `x` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `z` to the `attractions` table without a default value. This is not possible if the table is not empty.

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
    "z" REAL NOT NULL
);
INSERT INTO "new_attractions" ("description", "id", "location", "name") SELECT "description", "id", "location", "name" FROM "attractions";
DROP TABLE "attractions";
ALTER TABLE "new_attractions" RENAME TO "attractions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
