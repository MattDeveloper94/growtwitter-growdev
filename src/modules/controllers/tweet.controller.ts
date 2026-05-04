import { Request, Response } from "express";
import { CreateTweetDto, UpdateTweetDto } from "../dtos/tweet.dto";
import { TweeetService } from "../services/tweet.service";

const tweetService = new TweeetService();

export class TweetController {
    //                    Request<Params, ResBody, ReqBody> 
    public async create(req: Request<any, any, CreateTweetDto>, res: Response) {
        const usuarioId = req.body.usuarioId;
        const { conteudo, replyId } = req.body;

        const result = await tweetService.createTweet({
            usuarioId,
            conteudo,
            replyId
        });

        return res.json(result);
    }

    public async updateTweet(req: Request<{ id: string }, any, any>, res: Response) {
        const usuarioId = req.headers.id as string;
        const tweetId = req.params.id;
        const dados = req.body;

        const result = await tweetService.updateTweet(usuarioId, tweetId, dados);
        res.json(result);
    }

    public async deleteTweet(req: Request<{ id: string }, any, any>, res: Response) {
        const usuarioId = req.headers.id as string;
        const tweetId = req.params.id;

        const result = await tweetService.deleteTweet(usuarioId, tweetId);
        res.json(result);
    }
}