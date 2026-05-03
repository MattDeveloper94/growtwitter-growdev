import { Request, Response } from "express";
import { CreateTweetDto } from "../dtos/tweet.dto";
import { FollowService } from "../services/follow.service";

const followService = new FollowService();

export class FollowController {
    async toggleFollow(req: Request<{id: string}, any, CreateTweetDto>, res: Response) {
        const followerId = req.body.usuarioId;
        const followingId = req.params.id;

        if (!followingId)
            throw new Error('ID nao recebido!');

        const result = await followService.toggleFollow(followerId, followingId);
        return res.json(result);
    }
}