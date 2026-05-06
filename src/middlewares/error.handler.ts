import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

export function handleError(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof PrismaClientKnownRequestError) {
        console.log(`Erro Prisma [${err.code}]: ${err.message}`);
        
        return res.status(400).json({
            ok: false,
            message: "Erro no banco de dados",
            code: err.code
        });
    }

    console.log(err);

    return res.status(500).json({
        ok: false,
        message: "Erro interno do servidor"
    });
}