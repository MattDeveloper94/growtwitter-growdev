import { prisma } from "../../database/prismadb";
import { CreateUsuarioDto } from "../dtos/usuario.dto";

export class UsuarioRepository {
    public async CreateUsuario(dados: CreateUsuarioDto) {
        const usuario = await prisma.usuario.create({
            data: {
                ...dados,
                dtNascimento: new Date(dados.dtNascimento)
            }
        });
        return usuario;
    }
}