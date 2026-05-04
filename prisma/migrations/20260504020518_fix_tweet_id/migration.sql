/*
  Warnings:

  - The primary key for the `tweet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tweet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "db_growtwitter_schemas"."like" DROP CONSTRAINT "like_tweet_id_fkey";

-- DropForeignKey
ALTER TABLE "db_growtwitter_schemas"."tweet" DROP CONSTRAINT "tweet_reply_id_fkey";

-- AlterTable
ALTER TABLE "db_growtwitter_schemas"."tweet" DROP CONSTRAINT "tweet_pkey",
DROP COLUMN "id",
ADD COLUMN     "tweet_id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "tweet_pkey" PRIMARY KEY ("tweet_id");

-- AddForeignKey
ALTER TABLE "db_growtwitter_schemas"."tweet" ADD CONSTRAINT "tweet_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "db_growtwitter_schemas"."tweet"("tweet_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "db_growtwitter_schemas"."like" ADD CONSTRAINT "like_tweet_id_fkey" FOREIGN KEY ("tweet_id") REFERENCES "db_growtwitter_schemas"."tweet"("tweet_id") ON DELETE CASCADE ON UPDATE CASCADE;
