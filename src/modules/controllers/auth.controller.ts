import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginUsuarioDto } from "../dtos/auth.dto";
import { Result } from "pg";

const authService = new AuthService();

export class AuthController {
    async login(req: Request<any, any, LoginUsuarioDto>, res: Response) {
        const { login, senha } = req.body;
        
        const result = await authService.login({
            login,
            senha
        });

        return res.json(result);
    }
}