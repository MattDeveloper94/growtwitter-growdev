import { Request, Response } from "express";
import { CreateTweetDto } from "../dtos/tweet.dto";
import { LikeService } from "../services/like.service";

const likeService = new LikeService();

export class LikeController {
    async toggleLike(req: Request<{ id: string }, any, CreateTweetDto>, res: Response) {
        const usuarioId = req.body.usuarioId;
        const tweetId = req.params.id // id que vai vir pela rota - url

        if (!tweetId)
            throw new Error('ID não recebido!');

        const result = await likeService.toggleLike(usuarioId, tweetId);
        return res.json(result);
    }
}