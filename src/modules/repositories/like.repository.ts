import { prisma } from "../../database/prismadb";

export class LikeRepository {
    public async createLike(usuarioId: string, tweetId: string) {
        return await prisma.like.create({
            data: {
                usuarioId,
                tweetId
            }
        });
    }

    public async searchLike(usuarioId: string, tweetId: string) {
        return await prisma.like.findUnique({
            where: {
                usuarioId_tweetId: {
                    usuarioId,
                    tweetId
                }
            }
        });
    }

    public async deleteLike(usuarioId: string, tweetId: string) {
        return await prisma.like.delete({
            where: {
                usuarioId_tweetId: {
                    usuarioId,
                    tweetId
                }
            }
        });
    }
}