import { CreateTweetDto } from "../dtos/tweet.dto";
import { prisma } from "../../database/prismadb";

export class TweetRepository {
    //create tweet
    public async CreateTweet(dados: CreateTweetDto) {
        return await prisma.tweet.create({
            data: dados
        });
    }
}