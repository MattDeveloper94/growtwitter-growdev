import { Router, Request, Response } from "express";
import { TweetController } from "../controllers/tweet.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const tweetController = new TweetController();
const router = Router();

/**
 * @swagger
 * /tweets:
 *   post:
 *     summary: Criar tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conteudo
 *             properties:
 *               conteudo:
 *                 type: string
 *                 example: Meu primeiro tweet
 *               replyId:
 *                 type: string
 *                 nullable: true
 *                 example: "id_do_tweet_original"
 *     responses:
 *       201:
 *         description: Tweet criado com sucesso
 *       401:
 *         description: Token inválido ou não informado
 *       400:
 *         description: Erro ao criar tweet
 */
router.post("/tweets", authMiddleware, async (req: Request, res: Response) => {
    try {
        await tweetController.create(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * /tweets/{id}:
 *   put:
 *     summary: Atualizar tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do tweet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conteudo
 *             properties:
 *               conteudo:
 *                 type: string
 *                 example: Tweet atualizado
 *     responses:
 *       200:
 *         description: Tweet atualizado com sucesso
 *       401:
 *         description: Token inválido ou não informado
 *       400:
 *         description: Erro ao atualizar tweet
 */
router.put("/tweets/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await tweetController.updateTweet(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * /tweets/{id}:
 *   delete:
 *     summary: Deletar tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do tweet
 *     responses:
 *       204:
 *         description: Tweet deletado com sucesso
 *       401:
 *         description: Token inválido ou não informado
 *       400:
 *         description: Erro ao deletar tweet
 */
router.delete("/tweets/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await tweetController.deleteTweet(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * /listar/tweets:
 *   get:
 *     summary: Listar tweets
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tweets retornada com sucesso
 *       401:
 *         description: Token inválido ou não informado
 *       400:
 *         description: Erro ao listar tweets
 */
router.get("/listar/tweets", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await tweetController.listarTweets(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

export default router