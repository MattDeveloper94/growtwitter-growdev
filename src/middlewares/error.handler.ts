import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export function handleError(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof PrismaClientKnownRequestError) {
        console.log(`Erro Prisma [${err.code}]: ${err.message}`);
        
        return res.status(400).json({
            message: "Erro no banco de dados",
            code: err.code
        });
    }

    console.log(err);

    return res.status(500).json({
        message: "Erro interno do servidor"
    });
}