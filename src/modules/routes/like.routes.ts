import { Router } from "express";
import { LikeController } from "../controllers/like.controller";

const likeController = new LikeController();
const router = Router();

// API - toggle Like
router.post("/likes/:id", async (req, res) => {
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