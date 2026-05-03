import { prisma } from "../../database/prismadb";
import { CreateUsuarioDto } from "../dtos/usuario.dto";

export class UsuarioRepository {
    public async createUsuario(dados: CreateUsuarioDto) {
        return await prisma.usuario.create({
            data: {
                ...dados,
                dtNascimento: new Date(dados.dtNascimento)
            }
        });

    }
}