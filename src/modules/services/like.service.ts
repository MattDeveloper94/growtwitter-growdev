import { LikeRepository } from "../repositories/like.repository";

const likeRepository = new LikeRepository();

export class LikeService {
    async toggleLike(usuarioId: string, tweetId: string) {
        if (!usuarioId)
            throw new Error("Usuário logado não informado.");

        if (!tweetId)
            throw new Error("Tweet ID não informado.");

        const searchLike = await likeRepository.searchLike(usuarioId, tweetId);

        if (searchLike) {
            const deleteLike = await likeRepository.deleteLike(usuarioId, tweetId);

            return {
                ok: true,
                deleteLike,
                action: "removed"
            }
        }

        const createLike = await likeRepository.createLike(usuarioId, tweetId);

        return {
            ok: true,
            createLike,
            action: "created"
        }
    }
}