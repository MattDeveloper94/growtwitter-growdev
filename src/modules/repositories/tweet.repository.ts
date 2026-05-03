import { CreateTweetDto } from "../dtos/tweet.dto";
import { prisma } from "../../database/prismadb";

export class TweetRepository {
    //create tweet
    public async CreateTweet(dados: CreateTweetDto) {
        const tweet = await prisma.tweet.create({
            data: dados
        });
        return tweet;
    }
}