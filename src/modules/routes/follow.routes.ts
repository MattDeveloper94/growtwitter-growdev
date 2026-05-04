import { Router, Request, Response } from "express";
import { FollowController } from "../controllers/follow.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const followController = new FollowController();
const router = Router();

// API → toggle Follow
router.post("/follows/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await followController.toggleFollow(req, res)
    } catch (error: any) {
        res.status(400).send({
            ok: false,
            message: error.message
        });
        return;
    }
});

export default router;