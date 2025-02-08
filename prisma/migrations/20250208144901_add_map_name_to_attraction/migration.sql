/*
  Warnings:

  - You are about to drop the column `x` on the `attractions` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `attractions` table. All the data in the column will be lost.
  - You are about to drop the column `z` on the `attractions` table. All the data in the column will be lost.
  - Added the required column `camera_x` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `camera_y` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `camera_z` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_x` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_y` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_z` to the `attractions` table without a default value. This is not possible if the table is not empty.

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
    "camera_x" REAL NOT NULL,
    "camera_y" REAL NOT NULL,
    "camera_z" REAL NOT NULL,
    "target_x" REAL NOT NULL,
    "target_y" REAL NOT NULL,
    "target_z" REAL NOT NULL,
    "imagePath" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_attractions" ("description", "id", "imagePath", "isActive", "location", "map_name", "name") SELECT "description", "id", "imagePath", "isActive", "location", "map_name", "name" FROM "attractions";
DROP TABLE "attractions";
ALTER TABLE "new_attractions" RENAME TO "attractions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
