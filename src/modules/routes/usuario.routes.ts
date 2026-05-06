import { Router, Request, Response } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const usuarioController = new UsuarioController();
const router = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - username
 *               - email
 *               - senha
 *               - dtNascimento
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Matheus Rodrigues
 *               username:
 *                 type: string
 *                 example: matheus
 *               email:
 *                 type: string
 *                 example: matheus@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *               dtNascimento:
 *                 type: string
 *                 format: date
 *                 example: "2000-01-01"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro ao criar usuário
 */
router.post("/users", async (req, res) => {
    try {
        await usuarioController.create(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});


// API - get usuario por id

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       401:
 *         description: Token inválido ou não informado
 *       400:
 *         description: Erro ao buscar usuário
 */
router.get("/users/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await usuarioController.obterUsuarioPorId(req, res);
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

export default router