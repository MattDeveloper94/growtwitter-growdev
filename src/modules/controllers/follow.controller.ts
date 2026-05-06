import { Request, Response } from "express";
import { CreateTweetDto } from "../dtos/tweet.dto";
import { FollowService } from "../services/follow.service";

const followService = new FollowService();

export class FollowController {
    async toggleFollow(req: Request<{ id: string }, any, CreateTweetDto>, res: Response) {
        const followerId = req.usuario!.id;
        const followingId = req.params.id;

        if (!followingId)
            throw new Error('ID nao recebido!');

        if (followerId === followingId) {
            throw new Error("Você não pode seguir a si mesmo.");
        }

        const result = await followService.toggleFollow(followerId, followingId);

        if (result.action === "created")
            return res.status(201).json(result);
        else
            return res.status(200).json(result);
    }
}