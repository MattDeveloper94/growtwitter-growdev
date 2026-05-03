import { Request, Response } from "express";
import { CreateUsuarioDto } from "../dtos/usuario.dto";
import { UsuarioService } from "../services/usuario.service";

const usuarioService = new UsuarioService();

export class UsuarioController {
    public async create(req: Request<any, any, CreateUsuarioDto>, res: Response) {
        const { nome, username, email, senha, dtNascimento } = req.body;
        const result = await usuarioService.createUsuario({
            nome,
            username,
            email,
            senha,
            dtNascimento
        });

        return res.json(result)
    }
}