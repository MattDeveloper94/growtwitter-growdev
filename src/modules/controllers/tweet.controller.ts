import { Request, Response } from "express";
import { CreateTweetDto } from "../dtos/tweet.dto";
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
}