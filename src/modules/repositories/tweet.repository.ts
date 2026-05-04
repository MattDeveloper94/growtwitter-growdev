import { CreateTweetDto, UpdateTweetDto } from "../dtos/tweet.dto";
import { prisma } from "../../database/prismadb";

export class TweetRepository {
    //create tweet
    public async CreateTweet(dados: CreateTweetDto) {
        return await prisma.tweet.create({
            data: dados,
            include: {
                replyTo: {
                    select: {
                        replyId: true,
                        conteudo: true,
                        usuario: {
                            select: {
                                nome: true,
                                username: true
                            }
                        }
                    }
                }
            }
        });
    }

    // deletar tweet
    public async deletarTweetPorId(id: string) {
        const tweet = await prisma.tweet.delete({
            where: {
                tweetId: id
            }
        });
        return tweet;
    }


    // atualizar tweet
    public async updateTweet(id: string, dados: UpdateTweetDto) {
        const tweet = await prisma.tweet.update({
            where: {
                tweetId: id
            },
            data: dados
        });
        return tweet;
    }

    // obterporId
    public async obterPorId(id: string) {
        const tweet = await prisma.tweet.findUnique({
            where: {
                tweetId: id
            },
            select: {
                tweetId: true,
                usuarioId: true,
                conteudo: true,
            }
        });
        return tweet;
    }

}