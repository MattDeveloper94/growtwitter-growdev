import { CreateTweetDto, UpdateTweetDto } from "../dtos/tweet.dto"
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
            throw new Error("O tweet não pode estar vazio.");

        if (dados.conteudo.length > 280)
            throw new Error("Você pode usar apenas 280 caracteres.");

        //criando o tweet
        const tweetCriado = await tweetRepository.CreateTweet(dados);

        console.log('✅ Tweet criado:', tweetCriado);

        return {
            ok: true,
            tweet: tweetCriado
        }
    }

    async deleteTweet(usuarioLogadoId: string, tweetId: string) {
        const tweet = await this.obterPorId(tweetId);

        if (!tweet)
            throw new Error('Tweet nao encontrado!');

        if (tweet.tweetObtido?.usuarioId !== usuarioLogadoId)
            throw new Error('Você nao tem permissao para deletar esse tweet!');

        //deletando tweet
        const tweetDeletado = await tweetRepository.deletarTweetPorId(tweetId);

        console.log('✅ Tweet Deletado:', tweetDeletado);
        return {
            ok: true,
            tweet: tweetDeletado
        }
    }

    async updateTweet(usuarioLogadoId: string, tweetId: string, dados: UpdateTweetDto) {
        const tweet = await this.obterPorId(tweetId);

        if (!tweet)
            throw new Error('Tweet nao encontrado!');

        if (tweet.tweetObtido?.usuarioId != usuarioLogadoId)
            throw new Error('Você nao tem permissao para atualizar esse tweet!');

        if (dados.conteudo !== undefined) {
            dados.conteudo = dados.conteudo
                .trim()
                .split("\n")
                .map(linha => linha.trim())
                .join("\n")

            if (dados.conteudo.length > 280)
                throw new Error("Você pode tweetar usando apenas 280 caracteres.");


            if (!dados.conteudo)
                throw new Error("O tweet não pode estar vazio.");
        }

        const tweetAtualizado = await tweetRepository.updateTweet(tweetId, dados)
        console.log('✅ Tweet atualizado:', tweet);
        return {
            ok: true,
            tweetAtualizado
        }
    }

    async obterPorId(tweetId: string) {
        if (!tweetId)
            throw new Error('TweetID nao encontrado!');

        const tweetObtido = await tweetRepository.obterPorId(tweetId)
        console.log('✅ Tweet encontrado:', tweetObtido);
        return {
            ok: true,
            tweetObtido
        }
    }

    async listarTodosTweets(usuarioLogado: string) {
        const tweetsObtidos = await tweetRepository.listarTodosTweets(usuarioLogado)
        console.log('✅ Tweets encontrados:', tweetsObtidos);
        return {
            ok: true,
            tweetsObtidos
        }
    }
}