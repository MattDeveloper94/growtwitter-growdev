import { prisma } from "../../database/prismadb";

export class FollowRepository {
    async createFollow(followerId: string, followingId: string) {
        return await prisma.follow.create({
            data: {
                followerId,
                followingId
            }
        });
    }

    async deleteFollow(followerId: string, followingId: string) {
        return await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });
    }

    async searchFollow(followerId: string, followingId: string) {
        return await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        })
    }
}