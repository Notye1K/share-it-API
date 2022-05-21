-- CreateTable
CREATE TABLE "UserLikes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "publicationId" INTEGER NOT NULL,
    "like" BOOLEAN,

    CONSTRAINT "UserLikes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserLikes" ADD CONSTRAINT "UserLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikes" ADD CONSTRAINT "UserLikes_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
