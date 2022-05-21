/*
  Warnings:

  - You are about to drop the `UserLikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLikes" DROP CONSTRAINT "UserLikes_publicationId_fkey";

-- DropForeignKey
ALTER TABLE "UserLikes" DROP CONSTRAINT "UserLikes_userId_fkey";

-- DropTable
DROP TABLE "UserLikes";

-- CreateTable
CREATE TABLE "user-likes" (
    "userId" INTEGER NOT NULL,
    "publicationId" INTEGER NOT NULL,
    "like" BOOLEAN,

    CONSTRAINT "user-likes_pkey" PRIMARY KEY ("userId","publicationId")
);

-- AddForeignKey
ALTER TABLE "user-likes" ADD CONSTRAINT "user-likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user-likes" ADD CONSTRAINT "user-likes_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
