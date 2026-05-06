import "dotenv/config";
import express from "express";
import { handleError } from "./middlewares/error.handler";
import tweetRouter from "./modules/routes/tweet.routes";
import usuarioRouter from "./modules/routes/usuario.routes";
import toggleLikeRouter from "./modules/routes/like.routes";
import toggleFollowRouter from "./modules/routes/follow.routes";
import loginRouter from "./modules/routes/auth.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", tweetRouter);
app.use("/api", usuarioRouter);
app.use("/api", toggleLikeRouter);
app.use("/api", toggleFollowRouter);
app.use("/api", loginRouter);

app.get("/", (req, res) => {
    res.send("API rodando!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(handleError);

export default app;