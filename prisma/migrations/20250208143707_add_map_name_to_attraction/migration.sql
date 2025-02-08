/*
  Warnings:

  - Added the required column `map_name` to the `attractions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attractions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "map_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "z" REAL NOT NULL,
    "imagePath" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_attractions" ("description", "id", "imagePath", "isActive", "location", "name", "x", "y", "z") SELECT "description", "id", "imagePath", "isActive", "location", "name", "x", "y", "z" FROM "attractions";
DROP TABLE "attractions";
ALTER TABLE "new_attractions" RENAME TO "attractions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
