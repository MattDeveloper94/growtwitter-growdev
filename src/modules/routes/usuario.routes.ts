import { Router, Request, Response } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const usuarioController = new UsuarioController();
const router = Router();

//API → criar usuario
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