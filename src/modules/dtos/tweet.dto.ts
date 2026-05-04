export interface CreateTweetDto {
    usuarioId: string;
    conteudo: string;
    replyId?: string;
}

export interface UpdateTweetDto {
    tweetId: string
    conteudo: string
}
