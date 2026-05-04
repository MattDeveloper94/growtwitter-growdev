import { Router } from "express";
import { TweetController } from "../controllers/tweet.controller";

const tweetController = new TweetController();
const router = Router();

// API → criar tweet
router.post("/tweets", async (req, res) => {
    try {
        await tweetController.create(req, res)
    } catch (error: any) {
        return res.status(400).send({
            ok: false,
            message: error.message
        });
    }
});

router.put("/tweets/:id", async (req, res) => {
    try {
        await tweetController.updateTweet(req, res)
    } catch (error: any) {
        res.status(400).send({
            ok: false,
            message: error.message
        });
    }
});

router.delete("/tweets/:id", async (req, res) => {
    try {
        await tweetController.deleteTweet(req, res)
    } catch (error: any) {
        res.status(400).send({
            ok: false,
            message: error.message
        });
    }
});

export default router