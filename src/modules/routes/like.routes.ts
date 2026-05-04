import { Router, Request, Response } from "express";
import { LikeController } from "../controllers/like.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const likeController = new LikeController();
const router = Router();

// API - toggle Like
router.post("/likes/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await likeController.toggleLike(req, res)
    } catch (error: any) {
        res.status(400).send({
            ok: false,
            message: error.message
        });
        return;
    }
});

export default router;