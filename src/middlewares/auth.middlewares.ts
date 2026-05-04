import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = { id: string }
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    //autenticação header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Token inválido."
        });
        return;
    }

    const token = authHeader.split(" ")[1]?.trim();

    if (!token) {
        res.status(401).json({
            message: "Token inválido."
        });
        return;
    }

    try {
        //verificando se esse token foi criado com o segredo e se ele continua ativo.”
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.usuario = payload;

        next();

    } catch (error) {
        // console.error(error) → exibe o erro real no backend
        console.error(error);
        res.status(401).json({
            message: "Token inválido ou expirado." // resposta enviada ao frontend
        });
        return;
    }
}