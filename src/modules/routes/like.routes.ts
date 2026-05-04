import { Router } from "express";
import { LikeController } from "../controllers/like.controller";
import { TweetController } from "../controllers/tweet.controller";

const likeController = new LikeController();
const tweetController = new TweetController();
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