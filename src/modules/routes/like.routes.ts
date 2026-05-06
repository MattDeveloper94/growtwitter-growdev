import { Router, Request, Response } from "express";
import { LikeController } from "../controllers/like.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const likeController = new LikeController();
const router = Router();

// API - toggle Like
/**
 * @swagger
 * /likes/{id}:
 *   post:
 *     summary: Curtir ou remover curtida de um tweet
 *     tags: [Likes]
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
 *       200:
 *         description: Like criado ou removido com sucesso
 *       401:
 *         description: Token inválido ou não informado
 *       400:
 *         description: Erro ao curtir ou remover curtida
 */
router.post("/likes/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await likeController.toggleLike(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

export default router;