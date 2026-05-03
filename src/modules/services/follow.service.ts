import { FollowRepository } from "../repositories/follow.repository";

const followRepository = new FollowRepository();

export class FollowService {
    async toggleFollow(followerId: string, followingId: string) {
        if (!followerId)
            throw new Error("ID do usuario logado, não informado!");

        if (!followingId)
            throw new Error("Following ID nao recebido!");

        const searchFollow = await followRepository.searchFollow(followerId, followingId);

        if (searchFollow) {
            const deleteFollow = await followRepository.deleteFollow(followerId, followingId)
            console.log('✅ Unfollow!', deleteFollow);

            return {
                ok: true,
                deleteFollow
            }
        }

        const createFollow = await followRepository.createFollow(followerId, followingId)
        console.log('✅ Following!', createFollow);

        return {
            ok: true,
            createFollow
        }

    }
}