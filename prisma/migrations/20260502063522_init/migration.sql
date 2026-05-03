-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "db_growtwitter_schemas";

-- CreateTable
CREATE TABLE "db_growtwitter_schemas"."usuario" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR(80) NOT NULL,
    "username" VARCHAR(120) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "senha" TEXT NOT NULL,
    "dt_nascimento" DATE NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "db_growtwitter_schemas"."tweet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conteudo" VARCHAR(280) NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_update" TIMESTAMP(3) NOT NULL,
    "reply_id" UUID,
    "usuario_id" UUID NOT NULL,

    CONSTRAINT "tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "db_growtwitter_schemas"."follow" (
    "follower_id" UUID NOT NULL,
    "following_id" UUID NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("follower_id","following_id")
);

-- CreateTable
CREATE TABLE "db_growtwitter_schemas"."like" (
    "usuario_id" UUID NOT NULL,
    "tweet_id" UUID NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "like_pkey" PRIMARY KEY ("usuario_id","tweet_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_username_key" ON "db_growtwitter_schemas"."usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "db_growtwitter_schemas"."usuario"("email");

-- AddForeignKey
ALTER TABLE "db_growtwitter_schemas"."tweet" ADD CONSTRAINT "tweet_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "db_growtwitter_schemas"."tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "db_growtwitter_schemas"."tweet" ADD CONSTRAINT "tweet_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "db_growtwitter_schemas"."usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "db_growtwitter_schemas"."follow" ADD CONSTRAINT "follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "db_growtwitter_schemas"."usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "db_growtwitter_schemas"."follow" ADD CONSTRAINT "follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "db_growtwitter_schemas"."usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "db_growtwitter_schemas"."like" ADD CONSTRAINT "like_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "db_growtwitter_schemas"."usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "db_growtwitter_schemas"."like" ADD CONSTRAINT "like_tweet_id_fkey" FOREIGN KEY ("tweet_id") REFERENCES "db_growtwitter_schemas"."tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
