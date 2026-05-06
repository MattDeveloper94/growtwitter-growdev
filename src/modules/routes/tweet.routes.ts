import { Router, Request, Response } from "express";
import { TweetController } from "../controllers/tweet.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const tweetController = new TweetController();
const router = Router();

// API → criar tweet
router.post("/tweets", authMiddleware, async (req: Request, res: Response) => {
    try {
        await tweetController.create(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

router.put("/tweets/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await tweetController.updateTweet(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

router.delete("/tweets/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await tweetController.deleteTweet(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

router.get("/listar/tweets", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await tweetController.listarTweets(req, res)
    } catch (error: any) {
        return res.status(error.statusCode || 400).send({
            ok: false,
            message: error.message
        });
    }
});

export default router