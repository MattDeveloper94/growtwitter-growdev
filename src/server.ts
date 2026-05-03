import express from "express";
import { handleError } from "./middlewares/error.handler";
import tweetRouter from "./modules/routes/tweet.routes";
import usuarioRouter from "./modules/routes/usuario.routes";
import toggleLikeRouter from "./modules/routes/like.routes";
import toggleFollowRouter from "./modules/routes/follow.routes";

import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", tweetRouter);
app.use("/api", usuarioRouter);
app.use("/api", toggleLikeRouter);
app.use("/api", toggleFollowRouter);
//rota
app.get("/", (req, res) => {
    res.send("API rodando!");
});

app.get("/erro", (req, res) => {
    throw new Error("Teste de erro");
});

app.get("/prisma-erro", async (req, res) => {
    throw new Error("erro vindo do service");
});

//middleware de erro → só roda quando acontece erro depois das rotas.
app.use(handleError);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});