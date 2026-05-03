import { CreateTweetDto } from "../dtos/tweet.dto"
import { TweetRepository } from "../repositories/tweet.repository"

const tweetRepository = new TweetRepository();

export class TweeetService {
    async createTweet(dados: CreateTweetDto) {
        //tratamento de dados
        if (dados.conteudo) {
            dados.conteudo = dados.conteudo.trim()
                .split("\n")
                .map(linha => linha.trim())
                .join("\n")
        } else {
            "";
        }

        //validacao
        if (!dados.conteudo)
            throw new Error("O tweet não pode estar vazio.")

        if (dados.conteudo.length > 280)
            throw new Error("Você pode tweetar usando apenas 280 caracteres.");

        //criando o tweet
        const tweetCriado = await tweetRepository.CreateTweet(dados);

        console.log('✅ Tweet criado:', tweetCriado);

        return {
            ok: true,
            tweet: tweetCriado
        }
    }
}