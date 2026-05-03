import { Router } from "express";
import { FollowController } from "../controllers/follow.controller";

const followController = new FollowController();
const router = Router();

// API → toggle Follow
router.post("/follows/:id", async (req, res) => {
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