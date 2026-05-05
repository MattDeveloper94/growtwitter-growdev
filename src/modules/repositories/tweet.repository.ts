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
        return await prisma.tweet.delete({
            where: {
                tweetId: id
            }
        });
    }


    // atualizar tweet
    public async updateTweet(id: string, dados: UpdateTweetDto) {
        return await prisma.tweet.update({
            where: {
                tweetId: id
            },
            data: dados,
            select: {
                tweetId: true,
                conteudo: true,
                usuarioId: true,
                dtUpdate: true
            }
        });
    }

    // obterporId
    public async obterPorId(id: string) {
        return await prisma.tweet.findUnique({
            where: {
                tweetId: id
            },
            select: {
                tweetId: true,
                usuarioId: true,
                conteudo: true,
            }
        });
    }

    public async listarTodosTweets(usuarioLogado: string) {
        return await prisma.tweet.findMany({
            where: {
                usuarioId: usuarioLogado
            },
            include: {
                usuario: {
                    select: {
                        nome: true,
                        username: true
                    }
                }
            },
            orderBy: {
                dtCriacao: "desc"
            }
        });
    }
}