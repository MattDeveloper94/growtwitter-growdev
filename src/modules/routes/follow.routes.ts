import { Router, Request, Response } from "express";
import { FollowController } from "../controllers/follow.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const followController = new FollowController();
const router = Router();

// API → toggle Follow
/**
 * @swagger
 * /follows/{id}:
 *   post:
 *     summary: Seguir ou deixar de seguir um usuário
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário que será seguido ou deixará de ser seguido
 *     responses:
 *       200:
 *         description: Follow criado ou removido com sucesso
 *       401:
 *         description: Token inválido ou não informado
 *       400:
 *         description: Erro ao seguir ou deixar de seguir usuário
 */
router.post("/follows/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await followController.toggleFollow(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

export default router;