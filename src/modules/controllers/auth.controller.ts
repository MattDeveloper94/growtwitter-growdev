import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginUsuarioDto } from "../dtos/auth.dto";

const authService = new AuthService();

export class AuthController {
    async login(req: Request<any, any, LoginUsuarioDto>, res: Response) {
        const { login, senha } = req.body;
        
        const result = await authService.login({
            login,
            senha
        });

        return res.status(200).json(result);
    }
}