import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";

const usuarioController = new UsuarioController();
const router = Router();

//API → criar usuario
router.post("/users", async (req, res) => {
    try {
        await usuarioController.create(req, res)
    } catch (error: any) {
        return res.status(400).send({
            ok: false,
            message: error.message
        });
    }
});

export default router