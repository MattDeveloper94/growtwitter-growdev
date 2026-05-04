import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authController = new AuthController();
const router = Router()

router.post("/auth/login", async (req, res) => {
    try {
        await authController.login(req, res)
    } catch (error: any) {
        return res.status(400).json({
            ok: false,
            message: error.message
        });
    }
});

export default router;