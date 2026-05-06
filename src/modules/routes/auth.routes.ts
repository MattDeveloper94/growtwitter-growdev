import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authController = new AuthController();
const router = Router()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - senha
 *             properties:
 *               login:
 *                 type: string
 *                 example: matheus@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Erro ao realizar login
 */
router.post("/auth/login", async (req, res) => {
    try {
        await authController.login(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

export default router;