import { Request, Response } from "express";
import { CreateTweetDto, UpdateTweetDto } from "../dtos/tweet.dto";
import { TweeetService } from "../services/tweet.service";

const tweetService = new TweeetService();

export class TweetController {
    //                    Request<Params, ResBody, ReqBody> 
    public async create(req: Request<any, any, CreateTweetDto>, res: Response) {
        const usuarioId = req.usuario!.id
        const { conteudo, replyId } = req.body;

        const result = await tweetService.createTweet({
            usuarioId,
            conteudo,
            replyId
        });

        return res.status(201).json(result);
    }

    public async updateTweet(req: Request<{ id: string }, any, any>, res: Response) {
        const usuarioId = req.usuario!.id;
        const tweetId = req.params.id;
        const dados = req.body;

        const result = await tweetService.updateTweet(usuarioId, tweetId, dados);
        return res.status(200).json(result);
    }

    public async deleteTweet(req: Request<{ id: string }, any, any>, res: Response) {
        const usuarioId = req.usuario!.id;
        const tweetId = req.params.id;

        const result = await tweetService.deleteTweet(usuarioId, tweetId);
        return res.status(204).json(result);
    }

    public async listarTweets(req: Request<{ id: string }>, res: Response) {
        const usuarioLogado = req.usuario!.id;

        const result = await tweetService.listarTodosTweets(usuarioLogado);
        return res.status(200).json(result);
    }
}