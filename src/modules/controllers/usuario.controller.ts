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

        return res.status(201).json(result)
    }

    public async obterUsuarioPorId(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        const result = await usuarioService.obterUsuarioPorId(id);

        return res.status(200).json(result);
    }
}