import { CreateTweetDto, UpdateTweetDto } from "../dtos/tweet.dto";
import { TweetRepository } from "../repositories/tweet.repository";
import { AppError } from "../../middlewares/error.handler";

const tweetRepository = new TweetRepository();

export class TweeetService {
  async createTweet(dados: CreateTweetDto) {
    if (dados.conteudo) {
      dados.conteudo = dados.conteudo
        .trim()
        .split("\n")
        .map(linha => linha.trim())
        .join("\n");
    }

    if (!dados.conteudo) {
      throw new AppError("O tweet não pode estar vazio.", 400);
    }

    if (dados.conteudo.length > 280) {
      throw new AppError("Você pode usar apenas 280 caracteres.", 400);
    }

    const tweetCriado = await tweetRepository.CreateTweet(dados);

    return {
      ok: true,
      tweet: tweetCriado
    };
  }

  async deleteTweet(usuarioLogadoId: string, tweetId: string) {
    const tweet = await this.obterPorId(tweetId);

    if (!tweet.tweetObtido) {
      throw new AppError("Tweet não encontrado!", 404);
    }

    if (tweet.tweetObtido.usuarioId !== usuarioLogadoId) {
      throw new AppError(
        "Você não tem permissão para deletar esse tweet!",
        403
      );
    }

    const tweetDeletado = await tweetRepository.deletarTweetPorId(tweetId);

    return {
      ok: true,
      tweet: tweetDeletado
    };
  }

  async updateTweet(
    usuarioLogadoId: string,
    tweetId: string,
    dados: UpdateTweetDto
  ) {
    const tweet = await this.obterPorId(tweetId);

    if (!tweet.tweetObtido) {
      throw new AppError("Tweet não encontrado!", 404);
    }

    if (tweet.tweetObtido.usuarioId !== usuarioLogadoId) {
      throw new AppError(
        "Você não tem permissão para atualizar esse tweet!",
        403
      );
    }

    if (dados.conteudo !== undefined) {
      dados.conteudo = dados.conteudo
        .trim()
        .split("\n")
        .map(linha => linha.trim())
        .join("\n");

      if (!dados.conteudo) {
        throw new AppError("O tweet não pode estar vazio.", 400);
      }

      if (dados.conteudo.length > 280) {
        throw new AppError(
          "Você pode tweetar usando apenas 280 caracteres.",
          400
        );
      }
    }

    const tweetAtualizado = await tweetRepository.updateTweet(tweetId, dados);

    return {
      ok: true,
      tweetAtualizado
    };
  }

  async obterPorId(tweetId: string) {
    if (!tweetId) {
      throw new AppError("TweetID não encontrado!", 400);
    }

    const tweetObtido = await tweetRepository.obterPorId(tweetId);

    return {
      ok: true,
      tweetObtido
    };
  }

  async listarTodosTweets(usuarioLogado: string) {
    const tweetsObtidos = await tweetRepository.listarTodosTweets(usuarioLogado);

    return {
      ok: true,
      tweetsObtidos
    };
  }
}